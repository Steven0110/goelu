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

        return db.collection( "logs" ).find({author: ObjectID(userId)}).sort({createdAt: -1}).limit(25).toArray()
    })
    .then( result => {
        client.close()
        return callback(null, {
            lastActivities: result
        })
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}