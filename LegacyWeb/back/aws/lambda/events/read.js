const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        body    = event.body,
        userId  = event.userId
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    .then( () => {
        let db =    client.db( env.MONGO_DB_NAME )

        return db.collection( "events" ).find({userId: ObjectID(userId)}).toArray()
    })
    .then( result => {
        client.close()
        return callback(null, {
            events: result
        })
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}