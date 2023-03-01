const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false
    let env         = event.env,
        group       = event.body,
        groupId     = event.groupId,
        userId      = event.userId
    
    group.updatedAt = new Date()
    
    for( let i = 0 ; i < group.contacts.length ; i++ )
        group.contacts[ i ] = ObjectID( group.contacts[ i ] )

    delete group.createdAt
    delete group._id

    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })

    client.connect()
    .then( () => {
        let db =    client.db( env.MONGO_DB_NAME )
        let query = {_id: ObjectID( groupId ), userId: ObjectID( userId ) }

        return db.collection( "groups" ).update( query, [{ $addFields: group }] )
    })
    .then( result => {
        client.close()
        if( result.result.n === 1 )
            return callback(null, {
                message: "Group updated successfully"
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