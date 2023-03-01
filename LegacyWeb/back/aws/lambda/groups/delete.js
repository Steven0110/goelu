const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env         = event.env,
        body        = event.body,
        groupId     = event.groupId,
        userId      = event.userId
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true})

    client.connect()
    .then( () => {
        let db =    client.db( env.MONGO_DB_NAME )
        let query = {_id: ObjectID(groupId), userId: ObjectID(userId)}

        return db.collection( "groups" ).deleteOne(query)
    })
    .then( result => {
        client.close()
        if( result.result.n === 1 )
            return callback(null, {
                message: "Group deleted successfully"
            })
        else
            callback( new Error("Not found."))
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}