var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var PageSchema = new Schema({    
    name : String,   
});

var Page = mongoose.model('Country', PageSchema);

module.exports = Page;