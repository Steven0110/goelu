const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID
const mg = require("mailgun-js")({apiKey: "key-a3233c5888ee29398cd8190b3613e9c1", domain: "goelu.com"})

const removeIdDuplicates = idArray => {
    let filtered = []

    for( let i = 0 ; i < idArray.length ; i++ ){
        let found = false
        for( let j = 0 ; j < filtered.length ; j++ ){
            if( idArray[ i ].toString() == filtered[ j ].toString() ){
                found = true
                break
            }
        }

        if( !found )
            filtered.push( ObjectID(idArray[ i ]) )
    }

    return filtered
}

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env         = event.env,
        userId      = event.userId,
        targetId    = event.targetId,
        db

    let connectionStringURI = env.MONGO_CONNSTRING
    let owner

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })

    client.connect()
    .then( () => {

        /*  Set user as dead    */
        db = client.db( env.MONGO_DB_NAME )
        let killerQuery = { _id: ObjectID( targetId ) }
        let killerSetter = {$set: {dead: true}}
        return db.collection( "user" ).updateOne( killerQuery, killerSetter )

    })
    .then( () => {

        let pipeline = [
            {
                $match: {
                    userId: ObjectID( targetId ),
                    sent: {$exists: false},
                    contacts: {$exists: true}
                }
            },
            {
                $lookup: {
                    localField: "userId",
                    from: "user",
                    foreignField: "_id",
                    as: "user"
                },
            },
            {
                $unwind: {
                    path: "$user"
                }
            }
        ]

        return db.collection( "files" ).aggregate( pipeline ).toArray()

    })
    .then( files => {
        if( files && files.length > 0 ){

            owner = files[0].user
            let auxIds = []

            for( let i = 0 ; i < files.length ; i++ ){
                let file = files[ i ]
                let contacts = file.relationship.contacts

                if( contacts && contacts.length > 0 ){

                    for( let j = 0 ; j < contacts.length ; j++ )
                        auxIds.push( contacts[ j ] )

                }
            }

            if( auxIds.length == 0 ){
                return Promise.resolve({status: 1}) //No contacts found
            }else{
                console.log( "Aux found:", auxIds )
                let contactIds = removeIdDuplicates( auxIds )
                console.log( "Filtered:", contactIds )
                
                let query = {_id: {$in: contactIds}}
                return db.collection( "contacts" ).find( query ).toArray()
            }


        }else{
            return Promise.resolve({status: 0}) //Forbidden
        }
    })
    .then( result => {
        if( result.status == 0)
            return callback(new Error("Not found"))
        else if( result.status == 1)
            return callback(new Error("No contacts."))
        else{
            let contacts = result;

            /*  Set file as sent    */
            let setter = {$set: {sent: true}}
            let query = { userId: ObjectID( userId ), sent: {$exists: false}, contacts: {$exists: true}}
            
            /*  Set files as sent*/
            db.collection( "files" ).update( query, setter )
            .then( result => {

            })
            .then( result => {
                client.close();
                (function loop(i){
                    if( i >= contacts.length )
                        return callback(null, {"message": "Files sent"})
                    else{
                        let contact = contacts[ i ]
                        let name = contact.name
                        let template = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html> <head> <meta http-equiv="Content-Type" content="text/html charset=UTF-8"/> <style title="text/css"> @import url(https://fonts.googleapis.com/css?family=Raleway:400, 100, 200, 300, 500, 600, 800, 700, 900); </style> </head> <body> <div class="mail-container" style="padding: 15px; background-color: #eee;"> <div class="topbar" style="height: 50px;"> <div class="logo" style="display: inline-block; float: left;"><img style="width: 100px;" src="https://goelu-public.s3-us-west-2.amazonaws.com/img/goelU.png" alt="Goelu's logo"/></div><div class="contact" style="display: inline-block; float: right; width: 400px; height: 20px;"> <div class="social-media" style="display: inline-block; float: right;"> <a class="social-icon" href="https://www.facebook.com/Goelu-106499030889439"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/facebook.png" alt="Facebook" style="width: 20px;margin-left: 5px;"/></a> <a class="social-icon" href="https://twitter.com/GoelU"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/twitter.png" alt="Twitter" style="width: 20px;margin-left: 5px;"/></a> <a class="social-icon" href="https://www.instagram.com/goelu_official/"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/instagram.png" alt="Instagram" style="width: 20px;margin-left: 5px;"/></a> </div><div class="contact-info" style="clear: both;"> <div class="mail" style="display: inline-block; float: right; margin-left: 7px; margin-right: 7px; font-family: Raleway; font-size: 12px; font-weight: 500;"> <img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/correo.png" alt="Correo" style="width: 18px;margin-right: 5px;position: relative;top: 5px;"/> <span>contact@goelu.com</span> </div><div class="phone" style="display: inline-block; float: right; margin-left: 7px; margin-right: 7px; font-family: Raleway; font-size: 12px; font-weight: 500;"> <img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/servicio-al-cliente.png" alt="Teléfono" style="width: 18px;margin-right: 5px;position: relative;top: 5px;"/> <span>55 1234 5678</span> </div></div></div></div><div class="content" style="background-image: url('https://goelu-public.s3-us-west-2.amazonaws.com/img/background-email.jpg'); padding: 25px; background-size: cover; background-repeat: no-repeat;"> <div class="name" style="text-align: center; font-family: Raleway; color: white; font-weight: bold; font-size: 24px;">Dear ${name},</div><div class="presentation" style="text-align: center; font-family: Raleway; color: white; font-size: 20px; font-weight: 500;">${owner.name}left you some content before his/her death on goelU platform.</div><div class="inner-image" style="text-align: center; padding-top: 30px; padding-bottom: 30px;"> <img style="width: 40%; display: inline-block;" src="https://goelu-public.s3-us-west-2.amazonaws.com/img/mail-image.png" alt="Mail image"/> </div><div class="link" style="text-align: center;"> <div style="margin-bottom: -5px; line-height: 15px; margin-bottom: 10px;"> <a style="font-family: Raleway; color: white; text-decoration: none; font-weight: 900;" href="https://user.goelu.com">Click here</a> <span style="font-family: Raleway; color: white; text-decoration: none; font-weight: 500;">to check it. You have an account created in goelU. You can reset your password if needed.</span> </div></div><div class="final-message"><div style="text-align: center; font-family: Raleway; color: white; font-weight: bold;">The GoelU team</div></div></div></div></body></html>`
                        let params = {
                            html: template,
                            from: "Goelu <noreply@goelu.com>",
                            to: contact.emails,
                            subject: `You have new content from ${owner.name} | Goelu`
                        }

                        mg.messages().send(params, function (error, body) {
                            if( error )
                                console.log( error )
                            
                            loop(++i)
                        });
                    }
                })(0);
            })
            .catch( err => {
                console.log( err )
                callback(new Error(err))
            })

        }
    })
    .catch( err => {

        client.close();
        console.log( err )
        callback(new Error(err))
    })
}