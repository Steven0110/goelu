const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID
const mg = require("mailgun-js")({apiKey: "key-a3233c5888ee29398cd8190b3613e9c1", domain: "goelu.com"})

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false

    let env         = event.env,
        userId      = event.userId,
        fileId      = event.fileId,
        db

    let connectionStringURI = env.MONGO_CONNSTRING
    let owner, filename = ""

    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })

    client.connect()
    .then( () => {
        db =    client.db( env.MONGO_DB_NAME )
        let pipeline = [
            {
                $match: {_id: ObjectID( fileId )}
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
        if( files[0] ){

            let file = files[0]
            let contacts = file.relationship.contacts
            let groups = file.relationship.groups

            let query
            if( groups && groups.length > 0 ){
                owner = file.user.name
                filename = file.title

                /*  Obtiene contactos de los grupos */
                for( let i = 0 ; i < groups.length ; i++ )
                    groups[ i ] = ObjectID( groups[ i ] )
                
                query = {_id: {$in: groups}}

                return db.collection( "groups" ).find( query ).toArray()
                .then( _groups => {
                    /*  Reune todos los contactos en un array   */
                    let contacts = []
                    for( let i = 0 ; i < _groups.length ; i++ )
                        if( _groups[ i ].contacts && _groups[ i ].contacts.length > 0 ){
                            for( let k = 0 ; k < _groups[ i ].contacts.length ; k++ )
                                contacts.push( ObjectID(_groups[ i ].contacts[ k ]) )
                        }
                    
                    query = {_id: {$in: contacts}}
                    return db.collection( "contacts" ).aggregate([
                        {
                            $match: query
                        },
                        {
                            $project: {
                                name: 1,
                                emails: {
                                    $arrayElemAt: ["$emails", 0]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "relatives",
                                localField: "emails",
                                foreignField: "email",
                                as: "relative"
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                emails: 1,
                                relative: {
                                    $arrayElemAt: ["$relative", 0]
                                }
                            }
                        }
                    ]).toArray()

                })

            }else if( contacts && contacts.length > 0 ){
                owner = file.user.name
                filename = file.title

                for( let i = 0 ; i < contacts.length ; i++ )
                    contacts[ i ] = ObjectID( contacts[ i ] )

                query = {_id: {$in: contacts}}
                //return db.collection( "contacts" ).find( query ).toArray()
                return db.collection( "contacts" ).aggregate([
                    {
                        $match: query
                    },
                    {
                        $project: {
                            name: 1,
                            emails: {
                                $arrayElemAt: ["$emails", 0]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "relatives",
                            localField: "emails",
                            foreignField: "email",
                            as: "relative"
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            emails: 1,
                            relative: {
                                $arrayElemAt: ["$relative", 0]
                            }
                        }
                    }
                ]).toArray()
            }else
                return Promise.resolve({status: 1}) //No contacts in file

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
            let query = {_id: ObjectID( fileId )}
            
            db.collection( "files" ).updateOne( query, setter )
            .then( result => {

                client.close();
                (function loop(i){
                    if( i >= contacts.length )
                        return callback(null, {"message": "Files sent"})
                    else{
                        let contact = contacts[ i ]
                        let name = contact.name
                        let template
                        //console.log(JSON.stringify( contact))
                        let username = contact.emails
                        let tempPassword = contact.relative.tmpPassword

                        if( tempPassword && !contact.relative.password )
                            template = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html> <head> <meta http-equiv="Content-Type" content="text/html charset=UTF-8"/> <style title="text/css"> @import url( https://fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600,800,700,900); </style> </head> <body> <div class="mail-container" style="padding: 15px; background-color: #eee;"> <div class="topbar" style="height: 50px;"> <div class="logo" style="display: inline-block; float: left;"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/goelU.svg" alt="Goelu's logo" style="width: 100px;"/></div><div class="contact" style="display: inline-block; float: right; width: 280px; height: 20px;"> <div class="social-media" style="display: inline-block; float: right;"> <a class="social-icon" href="https://www.facebook.com/Goelu-106499030889439"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/facebook.png" alt="Facebook" style="width: 20px;margin-left: 5px;"/></a> <a class="social-icon" href="https://twitter.com/GoelU"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/twitter.png" alt="Twitter" style="width: 20px;margin-left: 5px;"/></a> <a class="social-icon" href="https://www.instagram.com/goelu_official/"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/instagram.png" alt="Instagram" style="width: 20px;margin-left: 5px;"/></a> </div><div class="contact-info" style="clear: both;"> <div class="mail" style="display: inline-block; float: right; margin-left: 7px; margin-right: 7px; font-family: Raleway; font-size: 12px; font-weight: 500;"> <img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/correo.png" alt="Correo" style="width: 18px;margin-right: 5px;position: relative;top: 5px;"/> <span>contact@goelu.com</span> </div><div class="phone" style="display: inline-block; float: right; margin-left: 7px; margin-right: 7px; font-family: Raleway; font-size: 12px; font-weight: 500;"> <img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/servicio-al-cliente.png" alt="Teléfono" style="width: 18px;margin-right: 5px;position: relative;top: 5px;"/> <span>55 1234 5678</span> </div></div></div></div><div class="content" style="background-image: url('https://goelu-public.s3-us-west-2.amazonaws.com/img/background-email.jpg'); padding: 25px; background-size: cover; background-repeat: no-repeat;"> <div class="name" style="text-align: center; font-family: Raleway; color: white; font-weight: 700; font-size: 24px;">Dear ${name},</div><div class="presentation" style="text-align: center; font-family: Raleway; color: white; font-size: 20px; font-weight: 500;">${owner} has uploaded some content for you<br/>(video/audio/file)<br/>on goelU platform:</div><div class="inner-image" style="text-align: center; padding-top: 30px; padding-bottom: 30px;"> <img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/mail-image.png" alt="Mail image" style="width: 50%; display: inline-block;margin-top:25px;margin-bottom:25px;"/> </div><div class="link" style="text-align: center;"> <div style="margin-bottom: -5px;"> <p> <a href="https://user.goelu.com" style="font-family: Raleway; color: white; text-decoration: none; font-weight: 700;padding-right: 50px;padding-left: 50px;padding-top: 7px;padding-bottom: 7px;background-color: #339ac4;border-radius:5px;">CLICK HERE</a> </p><span style="font-family: Raleway; color: white; text-decoration: none; font-weight: 500;">to see/hear/download it.</span> </div><div style="font-family: Raleway; color: white; text-decoration: none; font-weight: 500; margin-right: -5px;margin-bottom: 15px;">please access with these data:</div></div><div class="user-data" style="text-align: center;"> <div class="user-data-block" style="display: inline-block; background-color: rgba(255, 255, 255, 0.7); padding: 25px; padding-left: 50px; padding-right: 50px; border-radius: 15px;"> <div class="username" style="margin-bottom: 5px; margin-top: 5px; font-family: Raleway;"><b>Username: </b> ${username}</div><div class="password" style="margin-bottom: 5px; margin-top: 5px; font-family: Raleway;"><b>Password: </b> ${tempPassword}</div></div></div><div class="final-message"> <div style="text-align: center; font-family: Raleway; color: white; font-weight: 500;margin-top:25px">Hope you enjoy it!</div><div style="text-align: center; font-family: Raleway; color: white; font-weight: 700;margin-top:15px">The GoelU team</div></div></div></div></body></html>`
                        else
                            template = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html> <head> <meta http-equiv="Content-Type" content="text/html charset=UTF-8"/> <style title="text/css"> @import url( https://fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600,800,700,900); </style> </head> <body> <div class="mail-container" style="padding: 15px; background-color: #eee;"> <div class="topbar" style="height: 50px;"> <div class="logo" style="display: inline-block; float: left;"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/goelU.png" alt="Goelu's logo" style="width: 100px;"/></div><div class="contact" style="display: inline-block; float: right; width: 280px; height: 20px;"> <div class="social-media" style="display: inline-block; float: right;"> <a class="social-icon" href="https://www.facebook.com/Goelu-106499030889439"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/facebook.png" alt="Facebook" style="width: 20px;margin-left: 5px;"/></a> <a class="social-icon" href="https://twitter.com/GoelU"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/twitter.png" alt="Twitter" style="width: 20px;margin-left: 5px;"/></a> <a class="social-icon" href="https://www.instagram.com/goelu_official/"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/instagram.png" alt="Instagram" style="width: 20px;margin-left: 5px;"/></a> </div><div class="contact-info" style="clear: both;"> <div class="mail" style="display: inline-block; float: right; margin-left: 7px; margin-right: 7px; font-family: Raleway; font-size: 12px; font-weight: 500;"> <img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/correo.png" alt="Correo" style="width: 18px;margin-right: 5px;position: relative;top: 5px;"/> <span>contact@goelu.com</span> </div><div class="phone" style="display: inline-block; float: right; margin-left: 7px; margin-right: 7px; font-family: Raleway; font-size: 12px; font-weight: 500;"> <img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/servicio-al-cliente.png" alt="Teléfono" style="width: 18px;margin-right: 5px;position: relative;top: 5px;"/> <span>55 1234 5678</span> </div></div></div></div><div class="content" style="background-image: url('https://goelu-public.s3-us-west-2.amazonaws.com/img/background-email.jpg'); padding: 25px; background-size: cover; background-repeat: no-repeat;"> <div class="name" style="text-align: center; font-family: Raleway; color: white; font-weight: 700; font-size: 24px;">Dear ${name},</div><div class="presentation" style="text-align: center; font-family: Raleway; color: white; font-size: 20px; font-weight: 500;">${owner} has uploaded some content for you<br/>(video/audio/file)<br/>on goelU platform:</div><div class="inner-image" style="text-align: center; padding-top: 30px; padding-bottom: 30px;"> <img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/mail-image.png" alt="Mail image" style="width: 50%; display: inline-block;margin-top:25px;margin-bottom:25px;"/> </div><div class="link" style="text-align: center;"> <div style="margin-bottom: -5px;"> <p> <a href="https://user.goelu.com" style="font-family: Raleway; color: white; text-decoration: none; font-weight: 700;padding-right: 50px;padding-left: 50px;padding-top: 7px;padding-bottom: 7px;background-color: #339ac4;border-radius:5px;">CLICK HERE</a> </p><span style="font-family: Raleway; color: white; text-decoration: none; font-weight: 500;">to see/hear/download it.</span> </div></div><div class="final-message"> <div style="text-align: center; font-family: Raleway; color: white; font-weight: 500;margin-top: 25px;">Hope you enjoy it!</div><div style="text-align: center; font-family: Raleway; color: white; font-weight: 700;margin-top: 15px;">The GoelU team</div></div></div></div></body></html>`

                        let params = {
                            html: template,
                            from: "Goelu <noreply@goelu.com>",
                            to: contact.emails,
                            subject: `You have a new file from a Legacy Manager | Goelu`
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