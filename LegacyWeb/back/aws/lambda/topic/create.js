const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        topic   = event.body,
        userId  = event.userId

    let date = new Date()

    topic.userId = ObjectID( userId )
    topic.createdAt = date
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    .then( () => {
        let db =    client.db( env.MONGO_DB_NAME )

        return db.collection( "topics" ).insertOne( topic )
    })
    .then( result => {
        client.close()
        if( result.result.n === 1 ){
            return callback(null, {
                topic: result.ops[0]
            })
        }else
            return callback(new Error("Topic could not be created"))
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}