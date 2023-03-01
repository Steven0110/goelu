const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

const AWS = require('aws-sdk')
const s3 = new AWS.S3()
AWS.config.update({accessKeyId: 'AKIAI7Z3QNAVK37AAW7A', secretAccessKey: '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', region: "us-west-2"})

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        body    = event.body,
        userId  = event.userId
    
    let connectionStringURI = env.MONGO_CONNSTRING
    let db

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    .then( () => {
        db = client.db( env.MONGO_DB_NAME )
        let query = {
            userId: ObjectID(userId)
        }

        return db.collection( "files" ).find( query ).toArray()
    })
    .then( files => {
        
        /*  Borra ficheros físicamente  */
        let keys = files.map(file => {
            let key = file.url.split("amazonaws.com/")[1]
            return {
                Key: key
            }
        })
        if( keys.length > 0 ){

            let options = {
                Bucket: env.BUCKET,
                Delete: {
                    Objects: keys
                }
            }

            return s3.deleteObjects( options ).promise()
        }else{
            return Promise.resolve( "No Files" )
        }

    })
    .then( s3Result => {
        console.log( s3Result )
        /*  Borra ficheros de base de datos */
        let query = {
            userId: ObjectID(userId)
        }

        return db.collection( "files" ).deleteMany( query )
    })
    .then( () => {
        /*  Borra cuenta te usuario*/
        let query = {
            _id: ObjectID(userId)
        }
        console.log( query )
        return db.collection( "user" ).deleteOne( query )
        //return Promise.resolve(true)
    })
    .then( result => {
        client.close()
        return callback(null, {
            message: "Ok"
        })        
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}