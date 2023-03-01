const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        body    = event.body
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    .then( () => {
        let db =    client.db( env.MONGO_DB_NAME )

        return db.collection( "plan" ).find({deleted: null}).toArray()
    })
    .then( result => {
        client.close()
        return callback(null, {
            plans: result
        })
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}