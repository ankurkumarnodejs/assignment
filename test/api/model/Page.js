var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var PageSchema = new Schema({
    title: String,
    url : String,
    description: String
});

var Page = mongoose.model('Page', PageSchema);

module.exports = Page;