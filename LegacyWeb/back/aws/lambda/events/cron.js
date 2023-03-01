const mongoClient   = require('mongodb').MongoClient
const ObjectID      = require('mongodb').ObjectID
const mg = require("mailgun-js")({apiKey: "key-a3233c5888ee29398cd8190b3613e9c1", domain: "goelu.com"})

const connectionStringURI = process.env.MONGO_CONNSTRING
const dbname = process.env.MONGO_DB_NAME

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

const removeContactDuplicates = contacts => {
    let filtered = []
    for( let i = 0 ; i < contacts.length ; i++ ){
        let exists = false

        for( let j = 0 ; j < filtered.length ; j++ ){
            if( contacts[ i ].username == filtered[ j ].username )
                exists = true
        }

        if( !exists )
            filtered.push( contacts[ i ] )
    }

    return filtered
}

exports.handler = async (event, context) => {
    let client = new mongoClient( connectionStringURI, { useNewUrlParser: true, useUnifiedTopology: true })
    let db, currentDate, events
    
    currentDate = new Date()
    //console.log("Date: ", currentDate)
    try{

        await client.connect()
        db =    client.db( dbname )
        
        let query = {}
        query.notified = {$exists: false}
        query.date = {$lte: currentDate}

        let pipeline = [
            {
                $match: query
            },
            {
                $lookup: {
                    foreignField: "_id",
                    localField: "userId",
                    from: "user",
                    as: "owner"
                }
            },
            {
                $unwind: {
                    path: "$owner"
                }
            },
            {
                $project: {
                    "owner._id": 0,
                    "owner.type": 0,
                    "owner.password": 0,
                    "owner.ip": 0,
                    "owner.storage": 0,
                }
            },
            {
                $lookup: {
                    foreignField: "_id",
                    localField: "userId",
                    from: "user",
                    as: "owner"
                }
            },
            {
                $unwind: {
                    path: "$files"
                }
            },
            {
                $lookup: {
                    foreignField: "_id",
                    localField: "files",
                    from: "files",
                    as: "files"
                }
            },
            {
                $unwind: {
                    path: "$owner"
                }
            },
            {
                $unwind: {
                    path: "$files"
                }
            },
            {
                $match: {
                    "files.relationship.type": {
                        $in: ["event", "now"]
                    }
                }  
            },
            {
                $unwind: {
                    path: "$files.relationship.contacts",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    foreignField: "_id",
                    localField: "files.relationship.groups",
                    from: "groups",
                    as: "groups"
                }
            },
            {
                $lookup: {
                    foreignField: "_id",
                    localField: "files.relationship.contacts",
                    from: "contacts",
                    as: "contacts"
                }
            },
            {
                $unwind: {
                    path: "$groups",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    date: 1,
                    time: 1,
                    files: 1,
                    userId: 1,
                    createdAt: 1,
                    owner: 1,
                    gContacts: {
                        $ifNull: ["$groups.contacts", []]
                    },
                    contacts: 1
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    date: 1,
                    time: 1,
                    files: 1,
                    userId: 1,
                    createdAt: 1,
                    owner: 1,
                    gContacts: "$groups.contacts",
                    contacts: {$concatArrays: ["$contacts", "$gContacts"]}
                }
            },
            {
                $unwind: {
                    path: "$contacts",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "contacts",
                    localField: "contacts",
                    foreignField: "_id",
                    as: "contact"
                }
            },
            {
                $unwind: {
                    path: "$contact",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    date: 1,
                    time: 1,
                    files: 1,
                    userId: 1,
                    createdAt: 1,
                    contacts: 1,
                    owner: 1,
                    contact: {
                        $ifNull: ["$contact", "$contacts"]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    date: 1,
                    time: 1,
                    files: 1,
                    userId: 1,
                    createdAt: 1,
                    contacts: 1,
                    owner: 1,
                    contact: {
                        _id: 1,
                        name: 1,
                        emails: 1,
                        userId: 1,
                        tmpPassword: 1,
                        username: {
                            $arrayElemAt: ["$contact.emails", 0]
                        }  
                    }
                }
            },
            {
                $lookup: {
                    from: 'relatives',
                    localField: "contact.username",
                    foreignField: 'email',
                    as: 'contact.user'
                }  
            },
            {
                $unwind: {
                    path: "$contact.user",
                }
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name"},
                    address: { $first: "$address"},
                    notes: { $first: "$notes"},
                    time: { $first: "$time"},
                    owner: { $first: "$owner"},
                    name: { $first: "$name"},
                    files: { $push: "$files"},
                    contacts: { $push: "$contact"}
                }
            }
        ]

        let files = []

        events = await db.collection( "events" ).aggregate( pipeline ).toArray()

        if( events ){
            console.log("JSON Original;", events)
            //console.log("JSON Original;", JSON.stringify(events))

            for( let i = 0 ; i < events.length ; i++ ){
                let event = events[ i ]
                console.log("Sending event: ", event)

                event.contacts = removeContactDuplicates( event.contacts )
                console.log("Event filtered;", JSON.stringify(event))

                for( let j = 0 ; j < event.contacts.length ; j++ ){
                    let contact = event.contacts[ j ]

                    /*      Mail template and binding      */
                    let name        = contact.name,
                        username    = contact.username,
                        owner       = event.owner.name,
                        tempPassword= contact.user.tmpPassword

                    let template
                    if( tempPassword )
                        template = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html> <head> <meta http-equiv="Content-Type" content="text/html charset=UTF-8"/> <style title="text/css"> @import url( https://fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600,800,700,900); </style> </head> <body> <div class="mail-container" style="padding: 15px; background-color: #eee;"> <div class="topbar" style="height: 50px;"> <div class="logo" style="display: inline-block; float: left;"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/goelU.png" alt="Goelu's logo" style="width: 100px;"/></div><div class="contact" style="display: inline-block; float: right; width: 280px; height: 20px;"> <div class="social-media" style="display: inline-block; float: right;"> <a class="social-icon" href="https://www.facebook.com/Goelu-106499030889439"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/facebook.png" alt="Facebook" style="width: 20px;margin-left: 5px;"/></a> <a class="social-icon" href="https://twitter.com/GoelU"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/twitter.png" alt="Twitter" style="width: 20px;margin-left: 5px;"/></a> <a class="social-icon" href="https://www.instagram.com/goelu_official/"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/instagram.png" alt="Instagram" style="width: 20px;margin-left: 5px;"/></a> </div><div class="contact-info" style="clear: both;"> <div class="mail" style="display: inline-block; float: right; margin-left: 7px; margin-right: 7px; font-family: Raleway; font-size: 12px; font-weight: 500;"> <img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/correo.png" alt="Correo" style="width: 18px;margin-right: 5px;position: relative;top: 5px;"/> <span>contact@goelu.com</span> </div><div class="phone" style="display: inline-block; float: right; margin-left: 7px; margin-right: 7px; font-family: Raleway; font-size: 12px; font-weight: 500;"> <img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/servicio-al-cliente.png" alt="Teléfono" style="width: 18px;margin-right: 5px;position: relative;top: 5px;"/> <span>55 1234 5678</span> </div></div></div></div><div class="content" style="background-image: url('https://goelu-public.s3-us-west-2.amazonaws.com/img/background-email.jpg'); padding: 25px; background-size: cover; background-repeat: no-repeat;"> <div class="name" style="text-align: center; font-family: Raleway; color: white; font-weight: 700; font-size: 24px;">Dear ${name},</div><div class="presentation" style="text-align: center; font-family: Raleway; color: white; font-size: 20px; font-weight: 500;">${owner} has uploaded some content for you<br/>(video/audio/file)<br/>on goelU platform:</div><div class="inner-image" style="text-align: center; padding-top: 30px; padding-bottom: 30px;"> <img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/mail-image.png" alt="Mail image" style="width: 50%; display: inline-block;margin-top:25px;margin-bottom:25px;"/> </div><div class="link" style="text-align: center;"> <div style="margin-bottom: -5px;"> <p> <a href="https://user.goelu.com" style="font-family: Raleway; color: white; text-decoration: none; font-weight: 700;padding-right: 50px;padding-left: 50px;padding-top: 7px;padding-bottom: 7px;background-color: #339ac4;border-radius:5px;">CLICK HERE</a> </p><span style="font-family: Raleway; color: white; text-decoration: none; font-weight: 500;">to see/hear/download it.</span> </div><div style="font-family: Raleway; color: white; text-decoration: none; font-weight: 500; margin-right: -5px;margin-bottom: 15px;">please access with these data:</div></div><div class="user-data" style="text-align: center;"> <div class="user-data-block" style="display: inline-block; background-color: rgba(255, 255, 255, 0.7); padding: 25px; padding-left: 50px; padding-right: 50px; border-radius: 15px;"> <div class="username" style="margin-bottom: 5px; margin-top: 5px; font-family: Raleway;"><b>Username: </b> ${username}</div><div class="password" style="margin-bottom: 5px; margin-top: 5px; font-family: Raleway;"><b>Password: </b> ${tempPassword}</div></div></div><div class="final-message"> <div style="text-align: center; font-family: Raleway; color: white; font-weight: 500;margin-top:25px">Hope you enjoy it!</div><div style="text-align: center; font-family: Raleway; color: white; font-weight: 700;margin-top:15px">The GoelU team</div></div></div></div></body></html>`
                    else
                        template = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html> <head> <meta http-equiv="Content-Type" content="text/html charset=UTF-8"/> <style title="text/css"> @import url( https://fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600,800,700,900); </style> </head> <body> <div class="mail-container" style="padding: 15px; background-color: #eee;"> <div class="topbar" style="height: 50px;"> <div class="logo" style="display: inline-block; float: left;"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/goelU.png" alt="Goelu's logo" style="width: 100px;"/></div><div class="contact" style="display: inline-block; float: right; width: 280px; height: 20px;"> <div class="social-media" style="display: inline-block; float: right;"> <a class="social-icon" href="https://www.facebook.com/Goelu-106499030889439"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/facebook.png" alt="Facebook" style="width: 20px;margin-left: 5px;"/></a> <a class="social-icon" href="https://twitter.com/GoelU"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/twitter.png" alt="Twitter" style="width: 20px;margin-left: 5px;"/></a> <a class="social-icon" href="https://www.instagram.com/goelu_official/"><img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/instagram.png" alt="Instagram" style="width: 20px;margin-left: 5px;"/></a> </div><div class="contact-info" style="clear: both;"> <div class="mail" style="display: inline-block; float: right; margin-left: 7px; margin-right: 7px; font-family: Raleway; font-size: 12px; font-weight: 500;"> <img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/correo.png" alt="Correo" style="width: 18px;margin-right: 5px;position: relative;top: 5px;"/> <span>contact@goelu.com</span> </div><div class="phone" style="display: inline-block; float: right; margin-left: 7px; margin-right: 7px; font-family: Raleway; font-size: 12px; font-weight: 500;"> <img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/servicio-al-cliente.png" alt="Teléfono" style="width: 18px;margin-right: 5px;position: relative;top: 5px;"/> <span>55 1234 5678</span> </div></div></div></div><div class="content" style="background-image: url('https://goelu-public.s3-us-west-2.amazonaws.com/img/background-email.jpg'); padding: 25px; background-size: cover; background-repeat: no-repeat;"> <div class="name" style="text-align: center; font-family: Raleway; color: white; font-weight: 700; font-size: 24px;">Dear ${name},</div><div class="presentation" style="text-align: center; font-family: Raleway; color: white; font-size: 20px; font-weight: 500;">${owner} has uploaded some content for you<br/>(video/audio/file)<br/>on goelU platform:</div><div class="inner-image" style="text-align: center; padding-top: 30px; padding-bottom: 30px;"> <img src="https://goelu-public.s3-us-west-2.amazonaws.com/img/mail-image.png" alt="Mail image" style="width: 50%; display: inline-block;margin-top:25px;margin-bottom:25px;"/> </div><div class="link" style="text-align: center;"> <div style="margin-bottom: -5px;"> <p> <a href="https://user.goelu.com" style="font-family: Raleway; color: white; text-decoration: none; font-weight: 700;padding-right: 50px;padding-left: 50px;padding-top: 7px;padding-bottom: 7px;background-color: #339ac4;border-radius:5px;">CLICK HERE</a> </p><span style="font-family: Raleway; color: white; text-decoration: none; font-weight: 500;">to see/hear/download it.</span> </div></div><div class="final-message"> <div style="text-align: center; font-family: Raleway; color: white; font-weight: 500;margin-top: 25px;">Hope you enjoy it!</div><div style="text-align: center; font-family: Raleway; color: white; font-weight: 700;margin-top: 15px;">The GoelU team</div></div></div></div></body></html>` 

                    /*      Sends reminder      */
                    let params = {
                        html: template,
                        from: "Goelu <noreply@goelu.com>",
                        to: contact.emails.join(";"),
                        subject: "New content for you! | Goelu"
                    }                    

                    console.log("Tried to send: ", JSON.stringify(events[ i ]) )
                    await sendMail( params )
                    
                    /*      Set event as notified   */
                    query = { _id: ObjectID( event._id ) }
                    let setter = { $set: {notified: true} }
                    await db.collection("events").updateMany(query, setter)

                    /*      Set files as sent   */
                    files = files.concat( event.files )
                }
            }

            /*  Set files as sent  */
            let ids = files.map(file => {
                return ObjectID( file._id )
            })

            query = {
                _id: {
                    $in: ids
                }
            }
            let setter = {
                $set: {
                    sent: true
                }
            }

            await db.collection( "files" ).updateMany(query, setter)
        }

        return client.close()
    }catch(e){
        console.error( e )
        throw e
    }
}