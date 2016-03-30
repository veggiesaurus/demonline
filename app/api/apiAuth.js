var express = require('express');
var router = express.Router();
var routerProtected = express.Router();
var secrets = require('../../config/secrets.json');
var jwt = require('jsonwebtoken');

// route to log in 
router.post('/login', function (req, res) {
	
	if (req.body.username == secrets.adminUsername && req.body.password == secrets.adminPassword) {
		var token = jwt.sign({ username: secrets.adminUsername, group: 'admin' }, secrets.sessionSecret, {
			expiresIn: "24h"
		});
		
		// return the information including token as JSON
		res.json({
			success: true,
			message: 'Auth succeeded',
			token: token
		});
	}
	else
		res.json({ success: false, message: 'Authentication failed. User not found.' });
});


// route to log out 
routerProtected.post('/logout', function (req, res) {
	req.logOut();
	res.sendStatus(200);
});

module.exports = { pub: router, protected: routerProtected };