const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env         = event.env,
        body        = event.body,
        userId      = event.userId
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    .then( () => {
        let db =    client.db( env.MONGO_DB_NAME )
        let pipeline = [
            {
                $match: {
                    _id: ObjectID( userId )
                }
            },
            {
                $unwind: {
                    path: "$users"
                }
            },
            {
                $lookup: {
                    foreignField: "_id",
                    localField: "users",
                    from: "user",
                    as: "users"
                }
            },
            {
                $unwind: {
                    path: "$users"
                }
            },
            {
                $replaceRoot: {
                    newRoot: "$users"
                }
            },
            {
                $lookup: {
                    foreignField: "userId",
                    localField: "_id",
                    from: "files",
                    as: "files"
                }
            },
            {
                $unwind: {
                    path: "$files"
                }
            },
            {
                $replaceRoot: {
                    newRoot: "$files"
                }
            },
            {
                $match: {
                    "relationship.type": "legacy"
                }
            },
            {
                $lookup:  {
                    foreignField: "_id",
                    localField: "userId",
                    from: "user",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user"
                }
            },
            {
                $project: {
                    url: 0,
                    "user.type": 0,
                    "user.address": 0,
                    "user.updatedAt": 0,
                    "user.storage": 0,
                    "user.ip": 0,
                    "user.password": 0,
                    "user.phone": 0,
                    "user.occupation": 0,
                    "user.phone": 0,
                    "user.birthday": 0,
                    "user.legacyUsers": 0,
                    "user.gender": 0,
                }
            }
        ]

        return db.collection( "legacyUsers" ).aggregate( pipeline ).toArray()
    })
    .then( result => {
        client.close()
        return callback(null, {
            files: result
        })
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}