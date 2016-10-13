var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Block', new Schema({
	isLink: Boolean,
	title: String,
	text: String,
	created_by: String,
	created_on: { type: Date, default: Date.now }
}));