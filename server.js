var express = require('express');
var app = express();
var errorhandler = require('errorhandler')
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

//database config
var serverConfig = require('./config/general');
mongoose.connect(process.env.MONGOLAB_URI || serverConfig.dbURL);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb'}));
app.use(bodyParser.json({ limit: '2mb' }));

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

require('./app/routes.js')(app);

http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
	console.log('Web root: ' + ((process.env.WEB_ROOT || 'http://localhost')));
});
