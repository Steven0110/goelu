const jwt = require('jsonwebtoken')
const mongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID

const connectionStringURI = process.env.MONGO_CONNSTRING

const generatePolicy = (principalId, effect, resource, params) => {
    
    let authResponse = {}
    authResponse.principalId = principalId
    
    if( effect && resource ){
        
        let policyDocument = {}
        policyDocument.Version = '2012-10-17'
        policyDocument.Statement = []

        let statementOne = {}
        statementOne.Action = 'execute-api:Invoke'
        statementOne.Effect = effect
        statementOne.Resource = resource
        policyDocument.Statement[0] = statementOne
        authResponse.policyDocument = policyDocument

    }
    
    authResponse.context = params || false
    
    return authResponse
}

exports.handler = (event, context, callback) => {
    
    context.callbackWaitsForEmptyEventLoop = false

    let jwtToken = event.authorizationToken.replace(/Bearer\s/g, "")
    
    jwt.verify(jwtToken, process.env.SECRET, (err, decoded) => {

        if( err ){
            let errorData = {
                name:       err.name,
                message:    err.message
            }
            callback(null, generatePolicy('user', 'Deny', event.methodArn, errorData))
        }else{

            let client = new mongoClient( connectionStringURI, {useNewUrlParser: true, useUnifiedTopology: true})
            client.connect()
            .then( () => {

                let query = {"_id":  new ObjectId( decoded.id )}

                let db = client.db( process.env.MONGO_DBNAME )
                return db.collection( "relatives" ).findOne( query )
            })
            .then( user => {
                client.close()
                console.log( user )
                if( user ){
                    let params = {}
                    params.userId = decoded.id
                    params.userEmail = user.email
                    console.log("ok")
                    callback(null, generatePolicy('user', 'Allow', event.methodArn, params))
                }else{

                    console.log("nel")
                    callback("Unauthorized")
                }
            })
            .catch( dbError => {
                console.error( dbError )
                callback(null, generatePolicy('user', 'Deny', event.methodArn))
            })
        }

    })
}