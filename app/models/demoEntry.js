var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DemoEntrySchema = new Schema({
	title: { type: String, required: true },
	reference: { type: String, required: true, index: { unique: true }},
	category: { type: String, required: true, index: true },
	purpose: String,
	description: String,
	image: String,
	img: String,
	similarTo: [String]	
});

module.exports = mongoose.model('DemoEntry', DemoEntrySchema);