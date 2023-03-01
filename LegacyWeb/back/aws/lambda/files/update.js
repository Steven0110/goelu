const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        file    = event.body.file,
        _event  = event.body.event,
        fileId  = event.fileId,
        userId  = event.userId,
        _file
    
    file.updatedAt = new Date()

    if( file.topic && typeof file.topic == "string")
        file.topic = ObjectID( file.topic )

    if(file.relationship.contacts && file.relationship.contacts.length > 0)
        for( let i = 0 ; i < file.relationship.contacts.length ; i++ )
            file.relationship.contacts[ i ] = ObjectID( file.relationship.contacts[ i ] )

    if(file.relationship.groups && file.relationship.groups.length > 0)
        for( let i = 0 ; i < file.relationship.groups.length ; i++ )
            file.relationship.groups[ i ] = ObjectID( file.relationship.groups[ i ] )

    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    let q, u
    let db

    client.connect()
    .then( () => {
        db =    client.db( env.MONGO_DB_NAME )

        if( file._id ){
            delete file._id
            
            file.userId = ObjectID( userId )
            file.updatedAt = new Date()
            file.createdAt = new Date()
            file.url = file.url.split("?")[0]
            return db.collection( "files" ).insertOne( file )

        }else{
            q = {_id: ObjectID( fileId ), /*userId: ObjectID( userId )*/}
            u = [{ $addFields: file }]
            return db.collection( "files" ).findOneAndUpdate( q, u, {returnOriginal: false} )
        }
    })
    .then( result => {

        _file = result.value || result.ops[0]
        
        if( _event ){
            _event.userId = ObjectID( userId )
            _event.createdAt = new Date()
            _event.date = new Date( _event.date )
            _event.files = [ ObjectID(result.insertedId) ]

            return db.collection( "events" ).insertOne( _event )
        }else
            return Promise.resolve(false)
    })
    .then( result => {
        client.close()
        return callback(null, {
            file: _file,
            event: _event,
        }) 

    })
    .catch( err => {
        client.close()
        console.log( err )
        callback(new Error(err))
    })
}