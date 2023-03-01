const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

const AWS = require('aws-sdk')
const s3 = new AWS.S3()
AWS.config.update({accessKeyId: 'AKIAI7Z3QNAVK37AAW7A', secretAccessKey: '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', region: "us-west-2"})
const signedUrlExpireSeconds = 60 * 30

const presignURLs = (files, bucket) => {
    for( let i = 0 ; i < files.length ; i++ ){
        
        let key = files[ i ].url.split("amazonaws.com/")[1]
        let signedURL = s3.getSignedUrl('getObject', {
            Bucket: bucket,
            Key: key,
            Expires: signedUrlExpireSeconds
        })
        files[ i ].url = signedURL
    }
    return files
}

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        body    = event.body,
        userId  = event.userId
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    .then( () => {
        let db =    client.db( env.MONGO_DB_NAME )

        let pipeline = [
            {
                $match: {
                    userId: ObjectID(userId)
                }
            },
            {
                $lookup: {
                    from: "topics",
                    localField: "topic",
                    foreignField: "_id",
                    as: "topic"
                }

            },
        ]

        return db.collection( "files" ).aggregate( pipeline ).toArray()
    })
    .then( result => {
        client.close()
        return callback(null, {
            files: presignURLs( result, env.BUCKET )
        })
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}