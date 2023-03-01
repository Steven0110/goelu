const mongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const AWS = require('aws-sdk')

AWS.config.update({ accessKeyId: "AKIAI7Z3QNAVK37AAW7A", secretAccessKey: "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", region: "us-west-2" })
const s3 = new AWS.S3()

const mimeTypes = {
    "jpeg":     "image/jpeg",
    "jpg":      "image/jpeg",
    "jpe":      "image/jpeg",
    "gif":      "image/gif",
    "png":      "image/png",
}

const generateS3Key = (prefix, filetype, length) => {
    let alphabet = "abcdefghijlmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let hash = ""
    for( let i = 0 ; i < length ; i++ )
        hash += alphabet.charAt( Math.floor( Math.random() * alphabet.length ) )

    return prefix + "-" + hash + "." + filetype
}

const upload = params => {
    return new Promise((resolve, reject) => {
        s3.putObject(params, (err, data) => {
            console.error( err )
            err ? reject(new Error("Upload error")) : resolve(true)
        })
    })
}

exports.handler = (event, context, callback) => {

    context.callbackWaitsForEmptyEventLoop = false

    let userId  = event.userId
	let env     = event.env,
        body    = event.body

    let connectionStringURI = env.MONGO_CONNSTRING

    let client  = new mongoClient( connectionStringURI, { useNewUrlParser: true })
    let key, db

    client.connect()
    .then(() => {
    	let buffer  = new Buffer( body.asset.base64, "base64" )

        key = "assets/" + userId + "/" + generateS3Key("goelu", body.asset.filetype, 20)

        let params = {
            "Bucket": env.BUCKET,
            "Key": key,
            "ContentEncoding": "base64",
            "Body": buffer,
            "ACL": "public-read"
        }

        if( mimeTypes[ body.asset.filetype ] )
            params.ContentType = mimeTypes[ body.asset.filetype ]

        return upload( params )
    })
    .then( status => {
    	let newAsset = {
            "url":     		env.S3_HOST + key,
            "userId": 		ObjectId( userId ),
            "createdAt":    new Date()
        }

        db = client.db( env.MONGO_DB_NAME )

        return db.collection( "assets" ).insertOne( newAsset )
    })
    .then( result => {
        client.close()
        if( result.result.n === 1 ){
            return callback(null, {
                asset: result.ops[0]
            })
        }else
            return callback(new Error("Asset could not be created"))
    })
    .catch( err => {
        callback(Error(err))
    })

}