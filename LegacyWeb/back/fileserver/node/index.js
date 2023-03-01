"use strict";

require('dotenv').config();


const querystring = require('querystring');

//const request = require("request")
const express = require("express");
const requestp = require("request-promise")
const app = express()
const port = process.env.PORT

const router = require('./routes/index');


// Certificate
const http = require("http")
const https = require("https")
const fs = require("fs")

var privateKey, certificate, ca

if( process.env.LOCAL ){
	privateKey = fs.readFileSync('localcerts/private.key', 'utf8')
	certificate = fs.readFileSync('localcerts/certificate.pem', 'utf8')
}else{
	privateKey = fs.readFileSync('prodcerts/_.goelu.com.key', 'utf8')
	certificate = fs.readFileSync('prodcerts/_.goelu.com.crt', 'utf8')
}

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};


/*	CORS Settings 	*/
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}


/* 	Express.js App 	*/
app.use(allowCrossDomain);

/* 	Request Resolver for Express.js 	*/
const resolveRequest = function(res, status, body){
	return res.status(status).send(body);
}

/* 	Error handler 	*/
const throwError = function(err){
	console.error(err);
	return process.exit();
}

app.use(router)

/*	HTTPS 	*/
let server = https.createServer(credentials, app).listen(port, function() {
    console.log('HTTPS (local=' + !!process.env.LOCAL + ') server listening on port ' + port);

    if( !fs.existsSync("/tmp/legacy") )	 //Creates tmp directory for assets if not exists
    	fs.mkdirSync("/tmp/legacy")
})

/* 	Ends node server execution 	*/
process.on('SIGINT', function() {
    console.log("SERVER KILLED!");
    return server.close(function(err) {
		if(err) console.error(err)
		return process.exit();
	});
});
