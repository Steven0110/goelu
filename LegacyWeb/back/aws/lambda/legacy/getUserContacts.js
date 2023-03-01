const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        body    = event.body,
        ownerId  = event.ownerId
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    .then( () => {
        let db =    client.db( env.MONGO_DB_NAME )

        const q = {
            userId: ObjectID( ownerId )
        }

        return db.collection( "contacts" ).findMany( q )
    })
    .then( contacts => {
        client.close()
        return callback(null, {
            contacts: contacts
        })
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}