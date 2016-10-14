var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Block', new Schema({
	original_discussion: Schema.Types.Object,
	title: String,
	text: String,
	created_by: String,
	created_on: { type: Date, default: Date.now },
	relationships: [{ relatedResponse: Schema.Types.Object, relationshipType: String, numRelationships: Number }]
}));