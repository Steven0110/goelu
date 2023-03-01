const mongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

const connectionStringURI = process.env.MONGO_CONNSTRING

exports.handler = (event, context, callback) => {
    
    context.callbackWaitsForEmptyEventLoop = false

    let client = new mongoClient( connectionStringURI, {useNewUrlParser: true, useUnifiedTopology: true})
    let date = new Date()
    let _event

    if( event.files ){
        for( let i = 0 ; i < event.files.length ; i++ )
            event.files[ i ] = ObjectID( event.files[ i ] )
    }

    client.connect()
    .then( () => {

        let db = client.db( process.env.MONGO_DBNAME )
        let newEvent = event
        newEvent.userId = ObjectID(event.userId)
        newEvent.createdAt = date
        newEvent.date = new Date( newEvent.date )

        return db.collection( "events" ).insertOne( newEvent )
        .then( result => {
            _event = result.ops[0]
            /*     Insert to Log    */
            let entry = {
                author: ObjectID(event.userId),
                message: "Event '"+_event.name+"' added to calendar",
                createdAt: date,
                image: "/assets/icons/ic_ract_calendar.svg"
            }
            return db.collection( "logs" ).insertOne( entry )
        })
    })
    .then( result => {
        client.close()
        if( result.result.n === 1 ){
            callback(null, {event: _event} )
        }else
            callback(null, {
                error: "Event could not be saved to user's account"
            })
    })
    .catch( dbError => {
        console.error( dbError )
        callback(null, {error: dbError})
    })
}