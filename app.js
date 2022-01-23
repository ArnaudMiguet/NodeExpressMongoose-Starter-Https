const express = require('express');
const fs = require('fs');
const app = express();
const httpsMiddleware = require('./middlewares/httpsMiddleware');	
const http = require('http');
const https = require('https');

console.log('Running on ' + global.process.env.NODE_ENV + ' environment.');

const httpPort = global.process.env.NODE_ENV == 'development' ? 8080 : 80;
const httpsPort = global.process.env.NODE_ENV == 'development' ? 4430 : 443;

var sslOptions = {
	key: fs.readFileSync('./private.key'),
	cert: fs.readFileSync('./certificate.pem')
};

app.use(httpsMiddleware.middleware(httpsPort));

app.get('/', (_, res) => {
	console.log('hitting route');
	res.send('Hello World!');
});

http.createServer(app).listen(httpPort);
https.createServer(sslOptions, app).listen(httpsPort);
