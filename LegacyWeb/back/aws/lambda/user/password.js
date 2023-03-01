const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID
const sha512 = require('js-sha512').sha512
const mg = require("mailgun-js")({apiKey: "key-a3233c5888ee29398cd8190b3613e9c1", domain: "goelu.com"})

const sendMail = params => {
    return new Promise((resolve, reject) => {
        mg.messages().send(params, function (error, body) {
            if( error )
                reject(error)
            else
                resolve("Ok")
        });
    })
}

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env         = event.env,
        password    = event.body,
        userId      = event.userId,
        userEmail   = "",
        collection  = event.collection || "user",
        db,
        status

    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })

    client.connect()
    .then( () => {
        db = client.db( env.MONGO_DB_NAME )
        
        if( collection == "user"){
            let query = {_id: ObjectID( userId ), password: sha512(password.old)}
            return db.collection( collection ).findOne( query )
        }else{
            let mainQuery = {_id: ObjectID( userId ), password: sha512(password.old)}
            let tmpQuery = { _id: ObjectID( userId ), tmpPassword: password.old}
            return db.collection( collection ).findOne({ $or: [tmpQuery, mainQuery] })
        }

    })
    .then( user => {
        if( user ){
            userEmail = user.email

            if( collection == "user"){
                let updateBody = { $set: {password: sha512(password.new)} }
                let query = {_id: ObjectID( userId ), password: sha512(password.old)}
                return db.collection( collection ).updateOne( query, updateBody )
            }else{
                let updateBody = { $set: {password: sha512(password.new)} }
                let mainQuery = {_id: ObjectID( userId ), password: sha512(password.old)}
                let tmpQuery = { _id: ObjectID( userId ), tmpPassword: password.old}
                return db.collection( collection ).updateOne( { $or: [tmpQuery, mainQuery] }, updateBody )

            }
        }else
            return Promise.resolve(false)
    })
    .then( result => {
        client.close()
        status = result && result.result.n === 1


        if( status ){
            let template = `<div><h2 style="text-align: center; color: #8396d3; font-family: Arial;">Password reset confirmation</h2><p style="text-align: center;">Your account's password has been reset.</p><p style="text-align: center; margin-top: 0px; margin-bottom: 0px;">If it wasn't you, please send us an email to:</p><p style="text-align: center; margin-top: 0px; margin-bottom: 0px; color: #8396d3; font-family: Arial;">contact@goelu.com.</p></div>`
            let params = {
                html: template,
                from: "Goelu <noreply@goelu.com>",
                to: userEmail,
                subject: "Password reset | Goelu"
            }
            return sendMail( params )
        }else
            return Promise.resolve(status)
    })
    .then( result => {
        if( status )
            return callback(null, {
                message: "Password updated successfully"
            })
        else
            return callback(new Error("invalid password."))
    })
    .catch( err => {
        client.close()
        console.log( err )
        callback(new Error(err))
    })
}