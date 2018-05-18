var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var PromotionSchema = new Schema({
    name: String
});

var Promotion = mongoose.model('Promotion', PromotionSchema);

module.exports = Promotion;