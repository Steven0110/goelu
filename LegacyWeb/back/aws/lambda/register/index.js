const mongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const sha512 = require('js-sha512').sha512
const mailgun = require("mailgun-js")
const mg = mailgun({apiKey: "248c6fd05d40c6d354ad0a6363b5eb76-52b6835e-009684f3", domain: "goelu.com"})
var conekta = require('conekta')

conekta.api_key = process.env.CONEKTA_KEY

const randomstring = () => {
    return  Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
}
const randomPassword = () => Math.random().toString(36).substring(2, 15)

const createCustomer = customer => {

    return new Promise((resolve, reject) => {
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
                "unit_price": payment.amount * 100,
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
        conekta.Order.create(order, (err,order) => err ? reject( err ) : resolve( order.toObject() ))
    })
}

const sendMail = params => {
    return new Promise((resolve, reject) => {
        mg.messages().send(params, function (error, body) {
            if( error )
                reject(error)
            else
                resolve("Ok")
        });
    })
}

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        body    = event.body,
        type    = event.type
    
    let connectionStringURI = env.MONGO_CONNSTRING
    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    let user = {
        email:      body.email,
        name:       body.name,
        gender:     body.gender,
        plan:       body.plan,
        type:       "normal",
        storage:    0
    }

    if( user.plan && user.plan.endDate ){
        user.plan.endDate = new Date( user.plan.endDate )
    }

    if( body.password )
        user.password = sha512( body.password )

    user.ip = []
    user.legacyUsers = []

    if(type){
        switch( type ){
            case "legacy":
                user.associatedUser = ObjectID( body.userId )
                user.createdAt = new Date()
                user.updatedAt = new Date()
                user.password = sha512( randomPassword() )
                user.hash = sha512(Math.random().toString(36).slice(-10)).substr(0, 30)
                user.type = type
                break
            case "relative":
                user.password = sha512( randomPassword() )
                user.type = type
                user.hash = sha512(Math.random().toString(36).slice(-10)).substr(0, 30)
                break
        }
    }

    /*  Realiza el pago primero */
    console.log("body", body)
    return createCustomer( body )
    .then( customer => {
        let payment = {
            amount: body.plan.cost,
            customerId: customer.id,
            sourceId: customer.payment_sources.data[0].id
        }
        console.log( "payment", payment)

        return makePayment( payment )
    })
    .then( order => {
        return client.connect()
    })
    .then( () => {
        let db = client.db( env.MONGO_DB_NAME )
        return db.collection( "user" ).insertOne(user)
    })
    .then( status => {
        client.close()
        
        if( status.result.n )
            return callback(null, {
                code: 1,
                response: {
                    message: "Registro exitoso"
                }
            })
        else
            return callback(new Error("Invalid register."))
    })
    .catch( err => {
        console.log( JSON.stringify( err ) )
        let message
        if( err.code ){
            switch(err.code){
                case 11000:
                    message = "[error]|The email is already registered"
                    break
                default:
                    message = err.message
                    break
            }
            callback(new Error( message )) //Error en mongo
        }else if( err.details && err.details[0] ){ // Error de Conekta
            callback(null, {
                code: -1,
                response: {
                    message: err.details[0].message
                }
            })
        }
        
    })
}