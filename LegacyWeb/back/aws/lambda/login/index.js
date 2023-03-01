const jwt = require('jsonwebtoken')
const mongoClient = require('mongodb').MongoClient
const sha512 = require('js-sha512').sha512
const mg = require("mailgun-js")({apiKey: "key-a3233c5888ee29398cd8190b3613e9c1", domain: "goelu.com"})

const sendMail = params => {
    return new Promise((resolve, reject) => {
        mg.messages().send(params, function (error, body) {
            if( error )
                return reject(error)

            return resolve("Ok")
        });
    })
}

/*      Generates and sends new location code      */
const sendCode = (user, db) => {
    let code = Math.ceil( Math.random() * 1000000 ).toString()

    return db.collection( "user" ).updateOne({_id: user._id}, {$set: {verificationCode: code}})
    .then( result => {
        if( result.result.n === 1 ){
            let template = `<div><h2 style="text-align: center;color: #8396d3; font-family: Arial;">Verification code generated!<br></h2><p style="text-align: center;">This code was generated for Goelu.com, you will need it to log in.<br></p><p style="text-align: center;font-weight: bold">Code:<br></p><div style="text-align: center;"><span style="text-align: center;border: 1px solid #8396d3;border-radius: 7px; padding-top: 5px;padding-right: 5px; padding-left: 30px; padding-right: 30px;font-size: 24px;"><b>%%CODE%%</b></span></div></div>`;
            template = template.replace("%%CODE%%", code)
            
            let params = {
                html: template,
                from: "Goelu <noreply@goelu.com>",
                to: user.email,
                subject: "Verification code | Goelu"
            }
            return sendMail(params)
        }else{
            return Promise.reject("[error] The verification code could not be genereated.")
        }
    })
    
}

const success = (user, body, env, callback) => {
    let expires = body.rememberUser ? "15d" : "8h"
    let userBody = {
        id:             user._id,
        name:           user.name,
        email:          user.email,
        profileImage:   user.profileImage
    }

    let userToken = jwt.sign( userBody, env.SECRET, {
        expiresIn: expires
    })

    userBody.token = userToken

    return callback(null, {
        code: 1,
        response: {
            user: userBody
        }
    })
}

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env     = event.env,
        body    = event.body,
        ip      = event.ip,
        db
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    let query = {
        email:      body.email,
        password:   sha512( body.password )
    }

    if( event.adminCheck )
        query.admin = true

    if( event.legacyCheck )
        query.type = "legacy"

    client.connect()
    .then( () => {
        db = client.db( env.MONGO_DB_NAME )

        return db.collection( "user" ).findOne(query)
    })
    .then( user => {
        
        if( user ){
            if( body.code ){
                /*      Validates given code        */
                if ( user.verificationCode == body.code ){
                    /*      Deletes code and adds IP to trusted sources     */
                    return db.collection( "user" ).updateOne({_id: user._id}, {$unset: {verificationCode: 1}, $push: {ip: ip} })
                    .then(result => {
                        return success(user, body, env, callback)
                    })
                }else{
                    return callback(new Error("Invalid code."))
                }
            }else{
                /*      Checks user's IPs    */
                if( user.ip && user.ip.includes( ip )){
                    return success(user, body, env, callback)
                }else{
                    /*  Generates and sends code  */
                    return sendCode(user, db)
                            .then(response => {
                                return callback(null, {
                                    code: -1,
                                    response: {
                                        message: "Confirmation code sent to account's email"
                                    }
                                })
                            })
                }
            }


        }else{
            return callback( new Error("Invalid login."))
        }
    })
    .then(() => {
        return client.close()
    })
    .catch( err => {
        if( client )
            client.close()
        console.log("Error:", err)
        callback(Error(err))
    })
}