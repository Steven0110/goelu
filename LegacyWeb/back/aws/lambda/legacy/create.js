const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID
const mg = require("mailgun-js")({apiKey: "key-a3233c5888ee29398cd8190b3613e9c1", domain: "goelu.com"})

const randomString = length => {
   let result           = ''
   let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let charactersLength = characters.length;
   for ( let i = 0; i < length; i++ )
      result += characters.charAt(Math.floor(Math.random() * charactersLength))

   return result
}

const randomUsername = name => {
    let aux = name.toLowerCase().replace(/\s/g, "_")
    return `${aux}-${randomString(4)}`
}

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

    let env     = event.env,
        legacy  = event.body,
        userId  = event.userId,
        user

    let date = new Date(),
        db

    legacy.createdAt = date
    // Hack
    legacy.username = randomUsername(legacy.name)

    let _legacy = legacy
    let tmpPassword = randomString(15)
    let isNew = false
    
    let connectionStringURI = env.MONGO_CONNSTRING

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    .then( () => {
        /*  Agrega el contacto del legado al user   */
        db = client.db( env.MONGO_DB_NAME )
        let query = {_id: ObjectID( userId )}
        let setter = {$push: {legacyUsers: legacy}}

        return db.collection( "user" ).findOneAndUpdate( query, setter )
    })
    .then( result => {
        user = result.value
        /*  Inserta al contacto de legado como usuario */
        isNew = true

        legacy.ip = []
        legacy.tmpPassword = tmpPassword
        legacy.users = [ ObjectID(userId) ]

        return db.collection( "legacyUsers" ).insertOne(legacy)
    })
    .then( result => {

        /*      Mail template and binding      */
        let name = legacy.name,
            owner = user.name,
            username = legacy.username,
            tempPassword = tmpPassword

        let template = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html> <head> <meta http-equiv="Content-Type" content="text/html charset=UTF-8"/> <style title="text/css"> @import url( https://fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600,800,700,900); </style> </head> <body> <div class="mail-container" style="padding: 15px; background-color: #eee;"> <div class="topbar" style="height: 50px;"> <div class="logo" style="display: inline-block; float: left;"><img style="width: 100px;" src="https://goelu-public.s3-us-west-2.amazonaws.com/img/goelU.png" alt="Goelu's logo"/></div><div class="contact" style="display: inline-block; float: right; width: 280px; height: 20px;"> <div class="social-media" style="display: inline-block; float: right;"> <a class="social-icon" href="https://www.facebook.com/Goelu-106499030889439"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/facebook.png" alt="Facebook" style="width: 20px;margin-left: 5px;"/></a> <a class="social-icon" href="https://twitter.com/GoelU"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/twitter.png" alt="Twitter" style="width: 20px;margin-left: 5px;"/></a> <a class="social-icon" href="https://www.instagram.com/goelu_official/"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/instagram.png" alt="Instagram" style="width: 20px;margin-left: 5px;"/></a> </div><div class="contact-info" style="clear: both;"> <div class="mail" style="display: inline-block; float: right; margin-left: 7px; margin-right: 7px; font-family: Raleway; font-size: 12px; font-weight: 500;"> <img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/correo.png" alt="Correo" style="width: 18px;margin-right: 5px;position: relative;top: 5px;"/> <span>contact@goelu.com</span> </div><div class="phone" style="display: inline-block; float: right; margin-left: 7px; margin-right: 7px; font-family: Raleway; font-size: 12px; font-weight: 500;"> <img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/servicio-al-cliente.png" alt="Teléfono" style="width: 18px;margin-right: 5px;position: relative;top: 5px;"/> <span>55 1234 5678</span> </div></div></div></div><div class="content" style="background-image: url('https://goelu-public.s3-us-west-2.amazonaws.com/img/background-email.jpg'); padding: 25px; background-size: cover; background-repeat: no-repeat;"> <div class="name" style="text-align: center; font-family: Raleway; color: white; font-weight: bold; font-size: 24px;">Dear ${name},</div><div class="presentation" style="text-align: center; font-family: Raleway; color: white; font-size: 20px; font-weight: 500;">${owner} has added as his/her legacy contact on goelU platform:</div><div class="inner-image" style="text-align: center; padding-top: 30px; padding-bottom: 30px;"> <img style="width: 50%; display: inline-block;" src="https://goelu-public.s3-us-west-2.amazonaws.com/img/mail-image.png" alt="Mail image"/> </div><div class="link" style="text-align: center;"> <div style="margin-bottom: -5px;"> <p> <a href="https://legacy.goelu.com" style="font-family: Raleway; color: white; text-decoration: none; font-weight: 700;padding-right: 50px;padding-left: 50px;padding-top: 7px;padding-bottom: 7px;background-color: #339ac4;border-radius:5px;">CLICK HERE</a> </p><span style="font-family: Raleway; color: white; text-decoration: none; font-weight: 500;">to enter to your dashboard.</span> </div><div style="font-family: Raleway; color: white; text-decoration: none; font-weight: 500; margin-right: -5px;margin-bottom: 15px;">please access with these data:</div></div><div class="user-data" style="text-align: center;"> <div class="user-data-block" style="display: inline-block; background-color: rgba(255, 255, 255, 0.7); padding: 25px; padding-left: 50px; padding-right: 50px; border-radius: 15px;"> <div class="username" style="margin-bottom: 5px; margin-top: 5px; font-family: Raleway;"><strong>Username: </strong> ${username}</div><div class="password" style="margin-bottom: 5px; margin-top: 5px; font-family: Raleway;"><strong>Password: </strong> ${tempPassword}</div></div></div><div class="final-message"> <div style="text-align: center; font-family: Raleway; color: white; font-weight: 500;margin-top: 25px;">Hope you enjoy it!</div><div style="text-align: center; font-family: Raleway; color: white; font-weight: bold;margin-top: 15px;">The GoelU team</div></div></div></div></body></html>`;

        /*      Sends email      */
        let params = {
            html: template,
            from: "Goelu <noreply@goelu.com>",
            to: legacy.email,
            subject: `${owner} added you as his/her legacy contact | Goelu`
        }
        
        return sendMail( params )
    })
    .then( () => {
        /*     Insert to Log    */
        let entry = {
            author: ObjectID( userId ),
            message: "Legacy user '"+legacy.name+"' added",
            image: legacy.pictureURL,
            createdAt: date
        }

        return db.collection( "logs" ).insertOne( entry )
    })
    .then( () => {
        return callback(null, {
            legacyUser: _legacy
        })
    })
    .catch( err => {
        console.log( err )
        callback(new Error(err))
    })
}