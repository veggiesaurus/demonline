var express = require('express');
var router = express.Router();
var routerAdmin = express.Router();

var Category = require('../models/category');
var DemoEntry = require('../models/demoEntry');

//returns all categories matching the query
router.route('/')
.get(function (req, res) {
	Category.find(req.query, '-_id -__v', function (err, entries) {
		if (err)
			return res.status(400).send(err);
		if (entries)
			return res.json(entries);
		else
			return res.status(404).send({ error: 'Invalid query' });
	});
});

//adds a new category
routerAdmin.route('/')
.post(function (req, res) {
	var category = new Category(req.body);
	category.save(function (err) {
		if (err)
			return res.status(400).send(err);
		return res.json({ message: 'Category created', id: category.id });
	});
});

//updates a specific category
routerAdmin.route('/:prefix')
.put(function (req, res) {
	Category.findOneAndUpdate({ prefix: req.params.prefix }, req.body, function (err, category) {
		if (err)
			return res.status(400).send(err);
		if (category) {
			category.save(function (errSave) {
				if (errSave)
					return res.status(400).send(errSave);
				
				//update entries to point to new category prefix if the prefix has changed
				if (req.body.prefix && req.body.prefix != req.params.prefix) {
					DemoEntry.update({ category: req.params.prefix }, { $set:{ category: req.body.prefix } }, { multi: true }, function (errEntryUpdate) {
						if (errEntryUpdate)
							return res.status(400).send(errEntryUpdate);
						else
							return res.json({ message: 'Category updated, along with relevant entries', id: category.id });
					});
				}
				else
					return res.json({ message: 'Category updated', id: category.id });
			});
		}					
		else
			return res.status(404).send({ error: 'Invalid prefix' });
	});
});

//deletes a specific category
routerAdmin.route('/:prefix')
.delete(function (req, res) {
	Category.findOneAndRemove({ prefix: req.params.prefix }, function (err, category) {
		if (err)
			return res.status(400).send(err);
		if (category) {				
			DemoEntry.remove({ category: req.params.prefix }, function (errEntryRemove) {
				if (errEntryRemove)
					return res.status(400).send(errEntryUpdate);
				else
					return res.json({ message: 'Category removed, along with relevant entries', id: category.id });
			});
		}					
		else
			return res.status(404).send({ error: 'Invalid prefix' });
	});
});


//returns a specific category
router.route('/:prefix')
.get(function (req, res) {
	Category.findOne({ prefix: req.params.prefix }, '-_id -__v', function (err, category) {
		if (err)
			return res.status(400).send(err);
		if (category)
			return res.json(category);
		else
			return res.status(404).send({ error: 'Invalid prefix' });
	});
});


module.exports = { pub: router, admin: routerAdmin };
