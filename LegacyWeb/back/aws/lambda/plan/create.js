const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        body    = event.body,
        userId  = event.userId
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true})
    let plan = {
        name:       body.name,
        reference:  Math.random().toString(36).slice(-10),
        billingCycle: {
            interval:   body.billingCycle.interval,
            frequency:  Number(body.billingCycle.frequency)
        },
        owner:      ObjectID( userId ),
        quota: {
            unit:       body.quota.unit,
            quantity:   Number(body.quota.quantity)
        }

    }

    client.connect()
    .then( () => {
        let db = client.db( env.MONGO_DB_NAME )

        return db.collection( "plan" ).insertOne( plan )
    })
    .then( result => {
        client.close()
        
        if( result.result.n )
            return callback(null, {
                message: "Plan creado exitosamente",
                plan: result.ops[0]
            })
        else
            callback( new Error("Hubo un error al guardar el plan."))
    })
    .catch( err => {
        callback(new Error(err))
    })
}