const jwt = require('jsonwebtoken')
const mongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID

const connectionStringURI = process.env.MONGO_CONNSTRING

const getPermissions = permissions => {
    let p = []
    for( let i = 0 ; i < permissions.length ; i++ )
        p.push( permissions[ i ].data )

    return p
}

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
            //      Invalid Token
            callback(null, generatePolicy('user', 'Deny', event.methodArn, errorData))
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
                if( user && user.admin === true ){
                    let params = {}
                    params.userId = decoded.id
                    callback(null, generatePolicy('user', 'Allow', event.methodArn, params))
                }else
                    callback("Unauthorized")
            })
            .catch( dbError => {
                console.error( dbError )
                callback(null, generatePolicy('user', 'Deny', event.methodArn))
            })
        }

    })
}