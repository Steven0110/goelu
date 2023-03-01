const jwt = require('jsonwebtoken')
const mongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID

const connectionStringURI = process.env.MONGO_CONNSTRING

exports.handler = (event, context, callback) => {
    
    context.callbackWaitsForEmptyEventLoop = false

    let jwtToken = event.token
    
    jwt.verify(jwtToken, process.env.SECRET, (err, decoded) => {

        if( err ){
            let errorData = {
                name:       err.name,
                message:    err.message
            }
            callback(null, {error: errorData})
        }else{

            let client = new mongoClient( connectionStringURI, {useNewUrlParser: true, useUnifiedTopology: true})
            client.connect()
            .then( () => {

                let query = {"_id":  new ObjectId( decoded.id )}

                let db = client.db( process.env.MONGO_DBNAME )
                return db.collection( "user" ).findOne( query )
            })
            .then( user => {
                client.close()
                if( user ){
                    let params = {}
                    params.userId = decoded.id
                    callback(null, {
                        allow: true,
                        user: decoded
                    })
                }else
                    callback(null, {
                        allow: false
                    })
            })
            .catch( dbError => {
                console.error( dbError )
                callback(null, {error: dbError})
            })
        }

    })
}