var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('responseTitle', new Schema({
	title: String,
	
	created_on: { type: Date, default: Date.now },
}));