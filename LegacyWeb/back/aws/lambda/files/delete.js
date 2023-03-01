const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

const AWS = require('aws-sdk')
const s3 = new AWS.S3()
AWS.config.update({accessKeyId: 'AKIAI7Z3QNAVK37AAW7A', secretAccessKey: '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', region: "us-west-2"})

const bucket = process.env.BUCKET

const getFileKey = url => url.split("amazonaws.com/")[1]
const deleteObject = params => s3.deleteObject( params ).promise()

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        body    = event.body,
        fileId  = event.fileId,
        userId  = event.userId
    
    let connectionStringURI = env.MONGO_CONNSTRING
    let _file, db

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    .then( () => {
        db = client.db( env.MONGO_DB_NAME )
        let query = {_id: ObjectID(fileId), userId: ObjectID(userId)}

        /*  Delete from DB  */
        return db.collection( "files" ).findOneAndDelete(query)
    })
    .then( result => {
        _file = result.value

        /*  Add operation to logs  */
        let entry = {
            author: ObjectID(userId),
            message: `File ${_file.title} uploaded`,
            createdAt: new Date()
        }
        return db.collection( "logs" ).insertOne( entry )
    })
    .then( result => {
        /*      Update user storage     */
        let setter = { $inc: {storage: _file.size * -1} }
        let query = { _id: ObjectID( userId ) }
        return db.collection( "user" ).updateOne(query, setter)
    })
    .then( result => {
        client.close()
        /*  Delete from S3  */
        let params = {}
        params.Bucket = bucket
        params.Key = getFileKey( _file.url )

        return deleteObject( params )
    })
    .then( result => callback(null, {file: _file}) )
    .catch( err => {
        client.close()
        console.log( err )
        callback(new Error(err))
    })
}