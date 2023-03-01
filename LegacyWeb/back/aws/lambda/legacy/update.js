const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env         = event.env,
        legacy      = event.body,
        userId      = event.userId,
        db
    
    legacy.updatedAt = new Date()

    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })

    client.connect()
    .then( () => {
        db =    client.db( env.MONGO_DB_NAME )
        let query = {_id: ObjectID( userId )}

        return db.collection( "user" ).findOne( query )
    })
    .then( user => {
        let legacyUsers = user.legacyUsers || []

        let i
        for( i = 0 ; i < legacyUsers.length ; i++ )
            if( legacyUsers[ i ].email === legacy.email )
                break

        legacyUsers[ i ] = legacy

        let query = {_id: ObjectID( userId )}
        let setter = { $set: {legacyUsers: legacyUsers} }
        return db.collection( "user" ).updateOne( query, setter )
    })
    .then( result => {
        if( result.result.n === 1 )
            return callback(null, {
                message: "Contact legacy updated successfully"
            })
        else
            callback( new Error("Not found."))
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}