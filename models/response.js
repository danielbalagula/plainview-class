var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Block', new Schema({
	response_id: Schema.Types.ObjectId,
	title: String,
	text: String,
	created_by: String,
	created_on: { type: Date, default: Date.now },
	citation: Boolean,
	citationId: Schema.Types.ObjectId,
}));