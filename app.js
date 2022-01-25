import express from  'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import mongoose from 'mongoose';
import morgan from 'morgan';

import httpsMiddleware from './middlewares/httpsMiddleware.js';	

import {privateKey, certificate, databaseUrl} from './config/config.js';

const app = express();

console.log('Running on ' + global.process.env.NODE_ENV + ' environment.');

const httpPort = global.process.env.NODE_ENV == 'development' ? 8080 : 80;
const httpsPort = global.process.env.NODE_ENV == 'development' ? 4430 : 443;

var sslOptions = {
	key: fs.readFileSync(privateKey),
	cert: fs.readFileSync(certificate)
};

mongoose.connect(databaseUrl)
.then(() => {
	console.log('Successfully connected to database');
}).catch((err) => {
	console.log('Connection to database failed with error: ', err);
});

if (global.process.env.NODE_ENV == 'development') {
	app.use(morgan('dev'));
}

app.use(httpsMiddleware(httpsPort));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (_, res) => {
	res.send('Hello World!');
});

http.createServer(app).listen(httpPort, () => {
	console.log('Http server started on port ', httpPort);
});
https.createServer(sslOptions, app).listen(httpsPort, () => {
	console.log('Https server started on port ', httpsPort);
});
