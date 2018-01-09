var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StateSchema = new Schema({
"state" : String,
"district" : String,
"taluka": String
});

var State = mongoose.model('State', StateSchema);

// make this available to our users in our Node applications
module.exports = State;