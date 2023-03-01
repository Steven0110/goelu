const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        group   = event.body,
        userId  = event.userId

    let date = new Date()

    group.userId = ObjectID( userId )
    group.createdAt = date

    for( let i = 0 ; i < group.contacts.length ; i++ )
        group.contacts[ i ] = ObjectID( group.contacts[ i ] )
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    .then( () => {
        let db =    client.db( env.MONGO_DB_NAME )

        return db.collection( "groups" ).insertOne( group )
    })
    .then( result => {
        client.close()
        if( result.result.n === 1 ){
            return callback(null, {
                group: result.ops[0]
            })
        }else
            return callback(new Error("Group could not be created"))
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}