const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env         = event.env,
        user        = event.body,
        userId      = event.userId,
        collection  = event.collection || "user"
    
    user.updatedAt = new Date()

    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })

    client.connect()
    .then( () => {
        let db =    client.db( env.MONGO_DB_NAME )
        let query = {_id: ObjectID( userId )}

        return db.collection( collection ).update( query, [{ $addFields: user }] )
    })
    .then( result => {
        client.close()
        if( result.result.n === 1 )
            return callback(null, {
                message: "User updated successfully"
            })
        else
            callback( new Error("Not found."))
    })
    .catch( err => {
        client.close()
        console.log( err )
        callback(new Error(err))
    })
}