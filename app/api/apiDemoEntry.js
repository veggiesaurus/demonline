var express = require('express');
var router = express.Router();
var routerAdmin = express.Router();

var DemoEntry = require('../models/demoEntry');
var Category = require('../models/category');
//GET: returns all demoEntries matching the query
router.route('/')
.get(function (req, res) {
	DemoEntry.find(req.query, '-_id -__v', function (err, entries) {
		if (err)
			return res.status(400).send(err);
		return res.json(entries);
	});
});

//adds a new category
routerAdmin.route('/')
.post(function (req, res) {
	var entry = new DemoEntry(req.body);
	entry.save(function (err) {
		if (err)
			return res.status(400).send(err);
		return res.json({ message: 'Entry created', id: entry.id });
	});
});

router.route('/search')
.get(function (req, res) {
	var keyword = req.query.keyword;
	
	var query = DemoEntry.find({ title: new RegExp(keyword, "i") }, { _id: 0, title: 1, reference: 1, category: 1, purpose: 1 });
	if (req.query.limit)
		query = query.limit(req.query.limit);

	query.exec(function (err, entries) {
		if (err)
			return res.status(400).send(err);
		if (entries)
			return res.json(entries);
		else
			return res.status(404).send({ error: 'Invalid query' });
	});
});

router.route('/summary')
.get(function (req, res) {

	var query = DemoEntry.find(req.query, { _id: 0, title: 1, reference: 1, category: 1, purpose: 1 }).sort({ category: 1, reference: 1 });
	if (req.query.limit)
		query = query.limit(req.query.limit);
	query.exec(function (err, entries) {
		if (err)
			return res.status(400).send(err);
		if (entries)
			return res.json(entries);
		else
			return res.status(404).send({ error: 'Invalid query' });
	});
});

router.route('/summary/:ref')
.get(function (req, res) {
	DemoEntry.findOne({ reference: req.params.ref }, { _id: 0, title: 1, reference: 1, category: 1, purpose: 1 }, function (err, entry) {
		if (err)
			return res.status(400).send(err);
		if (entry)
			return res.json(entry);
		else
			return res.status(404).send({ error: 'Invalid ref' });
	});
});

router.route('/image/:ref')
.get(function (req, res) {
	DemoEntry.findOne({ reference: req.params.ref }, { _id: 0, img: 1 }, function (err, entry) {
		if (err)
			return res.status(400).send(err);
		if (entry)
			return res.json(entry);
		else
			return res.status(404).send({ error: 'Invalid ref' });		
	});
});


router.route('/ref/:ref')
.get(function (req, res) {
	DemoEntry.findOne({ reference: req.params.ref }, '-_id -__v', function (err, entry) {
		if (err)
			return res.status(400).send(err);
		if (entry) {
			//if there is an image without a specified format, assume it is a base64 jpg
			var dataString = 'data:';
			if (entry.img && entry.img.substring(0, dataString.length)!==dataString) {
				entry.img = 'data:image/jpg;base64,' + entry.img;
			}
			return res.json(entry);
		}
		else
			return res.status(404).send({ error: 'Invalid ref' });
	});
});

//updates a specific category
routerAdmin.route('/ref/:ref')
.put(function (req, res) {
	DemoEntry.findOneAndUpdate({ reference: req.params.ref }, req.body, function (err, entry) {
		if (err)
			return res.status(400).send(err);
		if (entry) {
			entry.save(function (errSave) {
				if (errSave)
					return res.status(400).send(errSave);
				else
					return res.json({ message: 'Entry updated', id: entry.id });
			});
		}					
		else
			return res.status(404).send({ error: 'Invalid reference' });
	});
});

module.exports = { pub: router, admin: routerAdmin };
