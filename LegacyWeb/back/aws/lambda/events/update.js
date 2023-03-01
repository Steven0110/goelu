const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        body    = event.body,
        eventId = event.eventId,
        userId  = event.userId
    
    let _event = body
    _event.updatedAt = new Date()
    //_event.category = ObjectID( _event.category )

    if( _event.date ){
        _event.date = new Date(_event.date)
    }
    if( _event.files ){
        for( let i = 0 ; i < _event.files.length ; i++ )
            _event.files[ i ] = ObjectID( _event.files[ i ] )
    }

    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })

    client.connect()
    .then( () => {
        let db =    client.db( env.MONGO_DB_NAME )
        let query = {_id: ObjectID( eventId ), userId: ObjectID( userId )}

        return db.collection( "events" ).findOneAndUpdate( query, [{ $addFields: _event }], {returnOriginal: false} )
    })
    .then( result => {
        client.close()
        if( result.ok == 1 )
            return callback(null, {
                event: result.value
            })
        else
            callback( new Error("Not found."))
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}