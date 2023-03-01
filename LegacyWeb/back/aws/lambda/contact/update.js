const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env         = event.env,
        contact     = event.body,
        contactId   = event.contactId,
        userId      = event.userId
    
    contact.updatedAt = new Date()

    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })

    client.connect()
    .then( () => {
        let db =    client.db( env.MONGO_DB_NAME )
        let query = {_id: ObjectID( contactId ), userId: ObjectID( userId ) }

        return db.collection( "contacts" ).update( query, [{ $addFields: contact }] )
    })
    .then( result => {
        client.close()
        if( result.result.n === 1 )
            return callback(null, {
                message: "Contact updated successfully"
            })
        else
            callback( new Error("Not found."))
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}