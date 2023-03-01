const mongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID

const connectionStringURI = process.env.MONGO_CONNSTRING
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
AWS.config.update({accessKeyId: 'AKIAI7Z3QNAVK37AAW7A', secretAccessKey: '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', region: "us-west-2"})

const presignURL = (url, bucket) => {
        
    let key = url.split("amazonaws.com/")[1]
    let signedURL = s3.getSignedUrl('getObject', {
        Bucket: bucket,
        Key: key,
        Expires: 60 * 30
    })
    return signedURL
}

exports.handler = (event, context, callback) => {
    
    context.callbackWaitsForEmptyEventLoop = false

    let client = new mongoClient( connectionStringURI, {useNewUrlParser: true, useUnifiedTopology: true})
    let date = new Date()
    let _file, db
    client.connect()
    .then( () => {

        db = client.db( process.env.MONGO_DBNAME )
        let file = {
            userId: ObjectId(event.userId),
            url: process.env.BASEURL + event.key,
            title: event.title,
            description: event.description,
            type: event.type,
            createdAt: date,
            relationship: event.relationship,
            size: event.size,
            isWord: event.isWord,
            isImage: event.isImage,
            isPdf: event.isPdf,
        }

        if(file.relationship.contacts && file.relationship.contacts.length > 0){
            for( let i = 0 ; i < file.relationship.contacts.length ; i++ )
                file.relationship.contacts[ i ] = ObjectId(file.relationship.contacts[ i ])
        }
        if( file.relationship.groups ){
            if( typeof file.relationship.groups == "string" ){
                let aux = JSON.parse(JSON.stringify(file.relationship.groups))
                file.relationship.groups = []
                file.relationship.groups[ 0 ] = ObjectId( aux )
            }else{
                if(file.relationship.groups && file.relationship.groups.length > 0){
                    for( let i = 0 ; i < file.relationship.groups.length ; i++ )
                        file.relationship.groups[ i ] = ObjectId(file.relationship.groups[ i ])
                }
            }
        }

        if( event.topic )
            file.topic = ObjectId( event.topic )

        return db.collection( "files" ).insertOne( file )
        .then( result => {
            _file = result.ops[0]
            /*     Insert to Log    */
            let entry = {
                author: ObjectId(event.userId),
                message: "File '"+_file.title+"' uploaded",
                createdAt: date,
                image: "/assets/icons/ic_ract_upl_file.svg"
            }
            return db.collection( "logs" ).insertOne( entry )
        })
    })
    .then( result => {
        /*      Update user file storage    */
        let setter = { $inc: {storage: event.size} }
        let query = { _id: ObjectId( event.userId ) }
        return db.collection( "user" ).updateOne(query, setter)
    })
    .then( result => {
        client.close()
        if( result.result.n === 1 ){
            _file.url = presignURL(_file.url, process.env.BUCKET)
            return callback(null, {file: _file} )
        }else
            return callback(new Error("[error] File could not be saved to user's account"))
    })
    .catch( dbError => {
        client.close()
        console.error( dbError )
        callback(null, {error: dbError})
    })
}