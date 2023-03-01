const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env         = event.env,
        legacyEmail = event.legacyEmail,
        userId      = event.userId,
        db

    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })

    client.connect()
    .then( () => {
        db =    client.db( env.MONGO_DB_NAME )
        let query = {_id: ObjectID( userId )}

        return db.collection( "user" ).findOne( query )
    })
    .then( user => {
        let legacyUsers = user.legacyUsers

        let i
        for( i = 0 ; i < legacyUsers.length ; i++ )
            if( legacyUsers[ i ].email === legacyEmail ){
                legacyUsers.splice(i, 1)
                break
            }

        let query = {_id: ObjectID( userId )}
        let setter = { $set: {legacyUsers: legacyUsers} }
        return db.collection( "user" ).updateOne( query, setter )
    })
    .then( result => {
        /*  Removes userid From legacy contact  */
        let query = {email: legacyEmail}
        let setter = {$pull: { users: ObjectID(userId) }}
        return db.collection( "legacyUsers" ).updateOne( query, setter )
    })
    .then( result => {
        if( result.result.n === 1 )
            return callback(null, {
                message: "Legacy contact deleted successfully"
            })
        else
            callback( new Error("Not found."))
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}