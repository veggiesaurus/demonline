var secrets = require('../config/secrets.json');
var jwt = require('jsonwebtoken');
module.exports = function (app, passport) {
	
	var authJWT = function (req, res, next) {
		var token = req.body.token || req.query.token || req.headers['x-access-token'];		
		// decode token
		if (token) {
			
			// verifies secret and checks exp
			jwt.verify(token, secrets.sessionSecret, function (err, decoded) {
				if (err) {
					return res.json({ success: false, message: 'Failed to authenticate token.' });
				} else {
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;
					next();
				}
			});

		} else {						
			return res.status(403).send({
				success: false, 
				message: 'No token provided.'
			});
    
		}
	};
	
	
	var apiAuth = require('./api/apiAuth');
	var apiDemoEntry = require('./api/apiDemoEntry');
	var apiCategory = require('./api/apiCategory');
	
	app.use('/api/auth', apiAuth.pub);
	app.use('/api/auth', authJWT,  apiAuth.protected);
	app.use('/api/demoEntry', apiDemoEntry.pub);
	app.use('/api/admin/demoEntry', authJWT, apiDemoEntry.admin);
	app.use('/api/cats', apiCategory.pub);
	app.use('/api/admin/cats', authJWT, apiCategory.admin);

	//all others get a 404
	app.get('/api/*', function (req, res) {
		res.status(404).send({ error: 'Invalid call' });
	}); 
};