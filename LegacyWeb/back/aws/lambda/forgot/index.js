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
const sendCode = (user, db, collection) => {
    let code = Math.ceil( Math.random() * 1000000 ).toString()

    return db.collection( collection ).updateOne({_id: user._id}, {$set: {verificationCode: code}})
    .then( result => {
        if( result.result.n === 1 ){
            let template = `<div><h2 style="text-align: center;color: #8396d3; font-family: Arial;">Verification code generated!<br></h2><p style="text-align: center;">This code was generated for Goelu.com, you will need it to reset your password.<br></p><p style="text-align: center;font-weight: bold">Code:<br></p><div style="text-align: center;"><span style="text-align: center;border: 1px solid #8396d3;border-radius: 7px; padding-top: 5px;padding-right: 5px; padding-left: 30px; padding-right: 30px;font-size: 24px;"><b>%%CODE%%</b></span></div></div>`;
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


exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env         = event.env,
        body        = event.body,
        ip          = event.ip,
        collection  = event.collection || "user",
        db
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    let query = {
        email:  body.email
    }


    client.connect()
    .then( () => {
        db = client.db( env.MONGO_DB_NAME )

        return db.collection( collection ).findOne(query)
    })
    .then( user => {
        
        if( user ){
            if( !body.password && body.code ){
                /*      Validates verification code        */
                if( user.verificationCode == body.code )
                    return callback(null, {
                        code: 1
                    })
                else
                    return callback(new Error("Invalid code."))

            }else if( body.password ){
                /*      Validates given code        */
                if ( user.verificationCode == body.code ){
                    /*      Updates password     */
                    let setter = {
                        $unset: {verificationCode: 1},
                        $set: {password: sha512( body.password )}
                    }
                    return db.collection( collection ).updateOne({_id: user._id}, setter)
                    .then(result => {
                        return callback(null, {
                            code: 1
                        })
                    })
                }else
                    return callback(new Error("Invalid code."))

            }else{
                /*  Generates and sends code  */
                return sendCode(user, db, collection)
                .then(response => {
                    return callback(null, {
                        code: -1,
                        response: {
                            message: "Confirmation code sent to account's email"
                        }
                    })
                })
            }

        }else
            return callback( new Error("Invalid email."))
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