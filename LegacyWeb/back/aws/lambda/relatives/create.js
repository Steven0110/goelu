const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        relative= event.body,
        userId  = event.userId

    let date = new Date()

    relative.createdAt = date
    relative.userId = ObjectID( userId )
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    .then( () => {
        let db =    client.db( env.MONGO_DB_NAME )

        return db.collection( "relatives" ).insertOne( relative )
    })
    .then( result => {
        client.close()
        if( result.result.n === 1 ){
        	return callback(null, {
        		relative: result.ops[0]
        	})
        }else
	        return callback(new Error("Event could not be created"))
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}