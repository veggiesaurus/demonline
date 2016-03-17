var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
	name: { type: String, required: true, index: { unique: true } },
	prefix: { type: String, required: true, index: { unique: true } },
	description: String,
	image: String,
});

module.exports = mongoose.model('Category', CategorySchema);