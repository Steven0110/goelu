const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env         = event.env,
        body        = event.body,
        userId      = event.userId
        //collection  = event.collection || "user"
    
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
                $project: {
                    email: 1,
                    name: 1,
                    pictureURL: 1,
                    phone: 1,
                    address: 1,
                    occupation: 1,
                    gender: 1,
                    birthday: 1,
                    dead: 1
                }
            }
        ]

        return db.collection( "legacyUsers" ).aggregate( pipeline ).toArray()
    })
    .then( result => {
        client.close()
        return callback(null, {
            users: result
        })
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}