
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerSchema = new Schema({
"name" : String,
"email": String,
"address" : String,
"phone" : Number,
"number" : Number,
"state" : String,
"district" : String,
"taluka" : String,
});

var Customer = mongoose.model('Customer', customerSchema);
// make this available to our users in our Node applications
module.exports = Customer;