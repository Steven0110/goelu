exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        userId  = event.userId
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    .then( () => {
        let db =    client.db( env.MONGO_DB_NAME )

        return db.collection( "groups" ).aggregate([
            {
                $match: {
                    userId: ObjectID( userId )
                }
            },
            {
                $unwind: {
                    path: "$contacts"
                }
            },
            {
                $lookup: {
                    from: "contacts",
                    localField: "contacts",
                    foreignField: "_id",
                    as: "contacts"
                }
            },
            {
                $unwind: {
                    path: "$contacts"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    contacts: {
                        $push: "$contacts"
                    },
                    name: { $first: "$name"},
                    pictureURL: { $first: "pictureURL"},
                    description: { $first: "$description"},
                    createdAt: { $first: "$createdAt"},
                }
            },
        ]).toArray()
    })
    .then( result => {
        client.close()
        return callback(null, {
            groups: result
        })
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}