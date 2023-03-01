const mongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
var conekta = require('conekta')

conekta.api_key = process.env.CONEKTA_KEY

const createCustomer = customer => {

    return new Promise((resolve, reject) => {
        console.log("Customer", JSON.stringify({
            name: customer.name,
            email: customer.email,
            payment_sources: [{
                token_id: customer.cardToken,
                type: 'card'
            }]
        }))

        conekta.Customer.create({
            name: customer.name,
            email: customer.email,
            payment_sources: [{
                token_id: customer.cardToken,
                type: 'card'
            }]
        }, function(err, customer) {
            err ? reject( err ) : resolve( customer.toObject() )
        })
    })
}
const makePayment = payment => {
    return new Promise((resolve, reject) => {
        const order = {
            "line_items": [{
                "name": "GOELU ONLINE SERVICES",
                "unit_price": Number(payment.amount) * 100,
                "quantity": 1
            }],
            "currency": "USD",
            "customer_info": {
                "customer_id": payment.customerId
            },
            "charges":[{
                "payment_method": {
                    'type': 'card',
                    'payment_source_id': payment.sourceId
                }
            }]
        }
        console.log("Order", JSON.stringify(order))
        conekta.Order.create(order, (err,order) => err ? reject( err ) : resolve( order.toObject() ))
    })
}

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        body    = event.body,
        userId  = event.userId,
        db
    
    let connectionStringURI = env.MONGO_CONNSTRING
    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })

    if( body.plan.endDate ){
        body.plan.endDate = new Date( body.plan.endDate )
    }
    console.log("Env", env)

    /*  Realiza el pago primero */
    client.connect()
    .then( () => {

        db =    client.db( env.MONGO_DB_NAME )
        const query = {_id: ObjectID(userId)}
        return db.collection( "user" ).findOne( query )
    })
    .then( user => {
        return createCustomer({
            name: body.card.name,
            email: user.email,
            cardToken: body.card.cardToken
        })
    })
    .then( customer => {
        let payment = {
            amount: body.plan.cost,
            customerId: customer.id,
            sourceId: customer.payment_sources.data[0].id
        }
        console.log( "payment", payment)

        return makePayment( payment )
    })
    .then( () => {
        /*  Actualiza el plan   */
        const query = {_id: ObjectID(userId)}
        let update = {
            $set: {
                plan: body.plan
            }
        }
        return db.collection( "user" ).updateOne(query, update)
    })
    .then( status => {
        client.close()

        return callback(null, {
            code: 1,
            response: {
                message: "Plan actualizado exitosamente"
            }
        })
    })
    .catch( err => {
        client.close()
        console.log( JSON.stringify( err ) )
        if( err.details && err.details[0] ){ // Error de Conekta
            callback(null, {
                code: -1,
                response: {
                    message: err.details[0].message
                }
            })
        }else
            callback( new Error( err ) )
    })
}