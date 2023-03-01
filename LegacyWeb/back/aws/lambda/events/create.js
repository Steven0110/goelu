const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        body    = event.body,
        userId  = event.userId

    let date = new Date()

    let _event = body
    _event.userId = ObjectID( userId )
    _event.createdAt = date
    _event.date = new Date( _event.date )

    if( _event.files ){
    	for( let i = 0 ; i < _event.files.length ; i++ )
    		_event.files[ i ] = ObjectID( _event.files[ i ] )
    }

    _event.category = ObjectID( _event.category )
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    .then( () => {
        let db =    client.db( env.MONGO_DB_NAME )

        return db.collection( "events" ).insertOne( _event )
    })
    .then( result => {
        client.close()
        if( result.result.n === 1 ){
        	return callback(null, {
        		event: result.ops[0]
        	})
        }else
	        return callback(new Error("Event could not be created"))
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}