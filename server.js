var express = require('express');
var app = express();
var errorhandler = require('errorhandler')
var http = require('http');
var path = require('path');
var secrets = require('./config/secrets.json');
var mongoose = require('mongoose');

//database config
mongoose.connect(process.env.MONGOLAB_URI || secrets.dbURL);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb'}));
app.use(bodyParser.json({ limit: '2mb' }));

//auth
var passport = require('passport');
require('./config/passportLocal')(passport);
app.use(passport.initialize());


// Add headers
app.use(function (req, res, next) {
	
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');
	
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	
	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	
	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);
	
	// Pass to next layer of middleware
	next();
});

// all environments
app.set('port', process.env.PORT || 3000);
// all environments

// development only
if ('development' == app.get('env')) {
	app.use(errorhandler());
}

require('./app/routes.js')(app, passport);
app.use(express.static('public'));

//single page app (routing handled on client side [angular-route.js]
app.get('*', function (req, res) {
	res.sendFile('index.html', { root: path.join(__dirname, '/public') });
});


http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
	console.log('Web root: ' + ((process.env.WEB_ROOT || 'http://localhost')));
});
