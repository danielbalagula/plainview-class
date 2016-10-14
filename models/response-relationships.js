var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Block', new Schema({
	original_discussion: Schema.Types.Object,
	//relationships: [{ relatedResponse: Schema.Types.Object, relationshipType: String, numRelationships: Number }]
}));
