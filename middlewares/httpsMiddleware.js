/**
 * Middleware used to enforce the use of https.
 *
 * @param {int} securePort
 */
export default function httpsMiddleware(securePort) { return (req, _, next) =>  {
	if (!req.secure) {
		console.log('Redirecting to https ...');
		console.log("https://" + req.hostname + ':' + securePort + req.url);
	}
	next();
};
}
