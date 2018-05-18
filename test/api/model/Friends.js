// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('../model/Customer.js');
// create a schema
var friendsSchema = new Schema({  
  FromId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  ToId:{ type: Schema.Types.ObjectId, ref: 'Customer' },
  status: { type: Number, default: 0 },
  created_at: Date,
  updated_at: Date
});


// the schema is useless so far
// we need to create a model using it
var Friend = mongoose.model('Friends', friendsSchema);

// make this available to our users in our Node applications
module.exports = Friend;