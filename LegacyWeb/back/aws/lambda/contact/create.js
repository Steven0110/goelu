const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

const randomString = length => {
   let result           = ''
   let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let charactersLength = characters.length;
   for ( let i = 0; i < length; i++ )
      result += characters.charAt(Math.floor(Math.random() * charactersLength))

   return result
}

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        contact = event.body,
        userId  = event.userId

    let date = new Date(),
        _contact,
        db

    contact.userId = ObjectID( userId )
    contact.createdAt = date
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    .then( () => {
        db = client.db( env.MONGO_DB_NAME )

        return db.collection( "contacts" ).insertOne( contact )
    })
    .then( result => {
        _contact = result.ops[0]
        if( result.result.n === 1 ){

            /*  Create new user  */
            let relativeUser = {
                email:      contact.emails[0],
                name:       contact.name,
                type:       "relative",
                tmpPassword:randomString(15),
                createdAt:  date,
                ip: []
            }

            let query = {email: relativeUser.email}

            return db.collection( "relatives" ).update(query, { $setOnInsert: relativeUser }, {upsert: true})

        }else
            return Promise.resolve(false)
    })
    .then( status => {
        /*     Insert to Log    */
        console.log("status", status)
        if( status ){
            let entry = {
                author: ObjectID( userId ),
                message: "Contact '"+contact.name+"' added",
                image: contact.pictureURL,
                createdAt: date
            }
            console.log("entry", entry)
            return db.collection( "logs" ).insertOne( entry )
        }else
            return Promise.resolve(false)
    })
    .then( status => {
        client.close()
        if( status ){
            return callback(null, {
                contact: _contact || {}
            })
        }else
            return callback(new Error("Contact could not be created"))
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}