const mongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        body    = event.body
    
    let connectionStringURI = env.MONGO_CONNSTRING
    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })

    client.connect()
    .then( () => {
        let db = client.db( env.MONGO_DB_NAME )
        let query = {
            email: body.email
        }
        return db.collection( "user" ).findOne(query)
    })
    .then( user => {
        if( user )
            return callback(new Error("Not available."), null)
        else
            return callback(null, {message: "Ok"})
    })
    .catch( err => {
        return callback(err, null)
    })
}