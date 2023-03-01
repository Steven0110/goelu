const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

const AWS = require('aws-sdk')
const s3 = new AWS.S3()
AWS.config.update({accessKeyId: 'AKIAI7Z3QNAVK37AAW7A', secretAccessKey: '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', region: "us-west-2"})
const signedUrlExpireSeconds = 60 * 5

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

const filterDuplicates = files => {
    let filtered = []

    for( let i = 0 ; i < files.length ; i++ ){
        let found = false
        for( let j = 0 ; j < filtered.length ; j++ ){
            if( files[ i ]._id.toString() == filtered[ j ]._id.toString() ){
                found = true
                break
            }
        }

        if( !found )
            filtered.push( files[ i ])
    }

    return filtered
}

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env         = event.env,
        body        = event.body,
        userId      = event.userId,
        userEmail   = event.userEmail,
        db
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let allFiles = []

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    try{
        await client.connect()

        db = client.db( env.MONGO_DB_NAME )

        let pipeline = [
            {
                $match: {
                    sent: true
                }
            },
            {
                $unwind: {
                    path: "$files.relationship.groups",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    foreignField: "_id",
                    localField: "relationship.groups",
                    from: "groups",
                    as: "group"
                }
            },
            {
                $unwind: {
                    path: "$group",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    url: 1,
                    updatedAt: 1,
                    type: 1,
                    topic: 1,
                    title: 1,
                    size: 1,
                    sent: 1,
                    isWord: 1,
                    isPdf: 1,
                    isImage: 1,
                    description: 1,
                    createdAt: 1,
                    relationship: 1,
                    group: {
                        $ifNull: [ "$group", {"contacts": []} ]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    url: 1,
                    updatedAt: 1,
                    type: 1,
                    topic: 1,
                    title: 1,
                    size: 1,
                    sent: 1,
                    isWord: 1,
                    isPdf: 1,
                    isImage: 1,
                    description: 1,
                    createdAt: 1,
                    contacts: {$concatArrays: ["$group.contacts", "$relationship.contacts"]}
                }
            },
            {
                $unwind: {
                    path: "$contacts",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "contacts",
                    localField: "contacts",
                    foreignField: "_id",
                    as: "contact"
                }
            },
            {
                $unwind: {
                    path: "$contact",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "contact.emails.0": userEmail
                }
            },
            {
                $project: {
                    contacts: 0,
                    contact: 0,
                    relationship: 0,
                    userId: 0
                }
            }
        ]

        const files =  await db.collection( "files" ).aggregate(pipeline).toArray()

        return { files: presignURLs( files, env.BUCKET ) }
    }catch(e){
        console.error( e )
        throw e
    }
}