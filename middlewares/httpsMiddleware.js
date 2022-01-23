exports.middleware = (securePort) => { return (req, res, next) =>  {
	if (!req.secure) {
		console.log('Redirecting to https ...');
		console.log("https://" + req.hostname + ':' + securePort + req.url);
	}
	console.log('using safe route');
	next();
};
};
