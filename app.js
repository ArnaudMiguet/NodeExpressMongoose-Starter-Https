// Modules import
import express from  'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import mongoose from 'mongoose';
import morgan from 'morgan';

// Config import
import {privateKey, certificate, databaseUrl} from './config/config.js';

// Custom modules import
import httpsMiddleware from './middlewares/httpsMiddleware.js';	

// Express app setup
const app = express();

const httpPort = global.process.env.NODE_ENV == 'development' ? 8080 : 80;
const httpsPort = global.process.env.NODE_ENV == 'development' ? 4430 : 443;

var sslOptions = {
	key: fs.readFileSync(privateKey),
	cert: fs.readFileSync(certificate)
};

// Mongoose setup
mongoose.connect(databaseUrl)
.then(() => {
	console.log('Successfully connected to database');
}).catch((err) => {
	console.log('Connection to database failed with error: ', err);
});

// Dev environment settings
if (global.process.env.NODE_ENV == 'development') {
	app.use(morgan('dev'));
	console.log('Running on ' + global.process.env.NODE_ENV + ' environment.');
}

// Middlewares
app.use(httpsMiddleware(httpsPort));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.get('/', (_, res) => {
	res.send('Hello World!');
});

// Server start
http.createServer(app).listen(httpPort, () => {
	console.log('Http server started on port ', httpPort);
});
https.createServer(sslOptions, app).listen(httpsPort, () => {
	console.log('Https server started on port ', httpsPort);
});
