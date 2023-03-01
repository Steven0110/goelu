require('dotenv').config();

var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser")
const mcache = require("memory-cache")
const busboy = require('connect-busboy')
const multer = require('multer')

const AWS = require('aws-sdk');
AWS.config.update({ accessKeyId: 'AKIAI7Z3QNAVK37AAW7A', secretAccessKey: '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', region: "us-west-2" })
const lambda = new AWS.Lambda({region: "us-west-2", accessKeyId: ""});
const s3 = new AWS.S3()
const fs = require("fs")

const types = {
    "image/jpeg": 		"other",
    "image/jpg": 		"other",
    "image/gif": 		"other",
    "image/png": 		"other",
    "audio/webm": 		"audio",
    "video/mp4": 		"video",
    "video/webm": 		"video",
    "video/x-matroska": "video"
}

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(busboy())

/*	Multer Config */
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      	callback(null, '/tmp/legacy');
    },
    filename: function (req, file, callback) {
    	if( file.originalname == "blob")
      		callback(null, new Date().toISOString() + '.webm')
    	else
      		callback(null, new Date().toISOString() + '-' + file.originalname)
    }
})
const upload = multer({storage: storage, limits: {fileSize : 1024 * 1024 * 1024 }})

/*	Upload Files to S3 	*/
const uploadFile = params => s3.putObject( params ).promise()

const randomString = length => {
	let alphabet = "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz0123456789"
	let string = ""
	for( let i = 0 ; i < length ; i++ )
		string += alphabet.charAt( Math.ceil( Math.random() * ( alphabet.length - 1 ) ) )

	return string
}

/*	Get file extension (.xlsx, .mp4, etc)  	*/
const getFileExtension = filename => {
	let parts = filename.split(".")
	return parts[ parts.length - 1 ]
}

/*	Get file Type for Goelu storage  	*/
const getFileType = mimeType => types[ mimeType ] || "other"

/*	Authorizer Functions */
const validateHeaders = function(req, res, next){
	if(req.headers.authorization)
		next()
	else
		res.status(403).json({message: "No autorizado"})
}
const authorizer = function(req, res, next){
	
	let token = req.headers.authorization.split(" ")[1]
	if( token ){
		/*	Invoke Auth Lambda 	*/
		const params = {
			FunctionName: "CheckToken" + process.env.LAMBDA,
			Payload: JSON.stringify({token: token}),
		}

		lambda.invoke(params).promise()
		.then( result => {
			result = JSON.parse( result.Payload )
			req.auth = result

			if( result.error ){
				console.log( result.error)
				res.status(403).json({message: "No autorizado"})
			}else
				next()
		})
		.catch( err => {
			console.log( err )
			res.status(403).json({message: "No autorizado"})
		})

	}else{
		res.status(403).json({message: "No autorizado"})
	}
}

router.post('/upload-media', [validateHeaders, authorizer, upload.single("file")], function(req, res){
	res.status(200).json({file: req.file})
})

router.post('/upload', [validateHeaders, authorizer], function(req, res){

	let formData = new Map()
	let chunk = null,
		tmpFilename,
		originalFilename,
		originalMimetype

	req.pipe(req.busboy)

	req.busboy.on('field', function(fieldname, val) {
		formData.set(fieldname, val)
    });

	req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
		
		originalMimetype = mimetype
		originalFilename = filename

		file.on('data', function(data) {
			chunk = data
      	})

		tmpFilename = formData.get("dzuuid") + "." + getFileExtension( filename )

		fstream = fs.createWriteStream('/tmp/legacy/' + tmpFilename, {flags: 'a'})
		file.pipe(fstream)

	})
	req.busboy.on('finish', function () {
		// Enviar full response hasta que se hayan recibidos todos los chunks
		res.status(200).json({
			file: {
				size: formData.get("dztotalfilesize"),
				path: `/tmp/legacy/${tmpFilename}`,
				filename: tmpFilename,
				originalFilename: originalFilename,
				destination: "/tmp/legacy",
				mimetype: originalMimetype,
				fieldname: "file"
			}
		})
	})
});

/*		Uploads file to S3 and saves it to user 	*/
router.post('/upload/file', [validateHeaders, authorizer], function(req, res){
	let key = `storage/${req.auth.user.id}/${randomString(6)}-${req.body.file.name}`
	let buffer = fs.readFileSync(req.body.file.tmpPath)
	let _file, _event
	let params = {
		"Bucket": process.env.BUCKET,
		"Key": key,
		"Body": buffer,
		"ACL": "public-read",
		//"ContentType": req.body.file.fileType
	}
	
	uploadFile( params )
	.then(result => {
		/*		Saves it to user 	*/
		let body = {
			userId: req.auth.user.id,
			type: getFileType(req.body.file.fileType),
			isWord: req.body.file.fileType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			isPdf: req.body.file.fileType == "application/pdf",
			isImage: req.body.file.fileType.includes("image/"),
			key: key,
			title: req.body.file.title,
			relationship: req.body.file.relationship,
			description: req.body.file.description,
			size: req.body.file.size,
			topic: req.body.file.topic,
		}
		console.log( body )
		let invokeParams = {
			FunctionName: "addFile" + process.env.LAMBDA,
			Payload: JSON.stringify(body),
		}
		return lambda.invoke(invokeParams).promise()
	})
	.then( result => {
		result = JSON.parse( result.Payload )

		if( result.error )
			return Promise.reject({message: "Error al subir el archivo", detail: result.error})
		else
			return Promise.resolve(result.file)
	})
	.then(file => {
		_file = file

		/*	Adds event if given 	*/
		let event = req.body.event
		if( event && event.date ){

			event.files = []
			event.files.push( file._id )
			event.userId = req.auth.user.id
			event.category = req.body.file.category

			let invokeParams = {
				FunctionName: "addEvent" + process.env.LAMBDA,
				Payload: JSON.stringify( event ),
			}
			return lambda.invoke(invokeParams).promise()
		}else{
			res.status(200).json({file: _file})
			return Promise.resolve( false )
		}
	})
	.then(result => {
		if( result ){
			_event = JSON.parse( result.Payload )
			res.status(200).json({file: _file, event: _event.event})
		}
	})
	.catch( err => {
		console.log( err )
		res.status(500).json({message: err.message || "Error al subir el archivo", detail: err })
	})
});

module.exports = router