const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env         = event.env,
        body        = event.body,
        userId      = event.userId,
        collection  = event.collection || "user"
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    .then( () => {
        let db =    client.db( env.MONGO_DB_NAME )
        let query = {_id: ObjectID(userId), deleted: null}
        let projection = {password: 0, _id: 0, ip: 0, type: 0, tmpPassword: 0}

        return db.collection( collection ).findOne(query, {projection: projection})
    })
    .then( user => {
        client.close()
        
        if( !user.legacyUsers )
            user.legacyUsers = []

        return callback(null, {
            user: user
        })
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}