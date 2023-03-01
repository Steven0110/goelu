const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

const AWS = require('aws-sdk')
const s3 = new AWS.S3()
AWS.config.update({accessKeyId: 'AKIAI7Z3QNAVK37AAW7A', secretAccessKey: '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', region: "us-west-2"})


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
        body    = event.body,
        fileId  = event.fileId,
        ownerId,
        db
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    .then( () => {
        db =    client.db( env.MONGO_DB_NAME )
        const q = {
            _id: ObjectID( fileId ),
            "relationship.allowLegacy": true
        }

        return db.collection( "files" ).findOne( q )
    })
    .then( file => {
        if( file ){
            ownerId = file.userId

            /*  Verifica que el usuario no exista   */
            const q = {
                email: body.email
            }
            return db.collection( "relatives" ).findOne( q )
        }else
            throw " notfound "
    })
    .then( relative => {
        if( !relative ){    //Agrega al usuario con una contraseña temporal

            let relativeUser = {
                email:      body.email,
                name:       body.name,
                type:       "relative",
                tmpPassword:randomString(15),
                createdAt:  new Date(),
                ip: []
            }
            return db.collection( "relatives" ).insertOne( relativeUser )
        }else{
            return Promise.resolve( true )
        }
    })
    .then( result => { /*  Agrega el contacto a la cuenta del admin */
        let contact = {
            name: body.name,
            emails: [body.email],
            extra: true,
            createdAt: new Date(),
            userId: ObjectID( ownerId ),
            pictureURL: "/assets/icons/avatar.svg"
        }
        return db.collection( "contacts" ).insertOne( contact )
    })
    .then( result => { /*  Agrega el contacto a la cuenta del admin */
        let contactId = ObjectID( result.insertedId )

        const q = {
            _id: ObjectID( fileId )
        }
        const u = {
            $push: {
                "relationship.contacts": contactId
            }
        }
        return db.collection( "files" ).updateOne( q, u )
    })
    .then( result => {
        client.close()
        return callback(null, {
            message: "ok"
        })
    })
    .catch( err => {
        client.close()
        console.log( err )
        callback(new Error(err))
    })
}