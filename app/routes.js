module.exports = function (app) {
	var apiDemoEntry = require('./api/apiDemoEntry');
	var apiCategory = require('./api/apiCategory');
	app.use('/api/demoEntry', apiDemoEntry.pub);
	app.use('/api/admin/demoEntry', apiDemoEntry.admin);
	app.use('/api/cats', apiCategory.pub);
	app.use('/api/admin/cats', apiCategory.admin);

	//all others get a 404
	app.get('/api/*', function (req, res) {
		res.status(404).send({ error: 'Invalid call' });
	}); 
};