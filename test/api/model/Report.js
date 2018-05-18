
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('../model/Customer.js');

var friendsSchema = new Schema({
  FromId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  ForId : { type: Schema.Types.ObjectId, ref: 'Customer' },
  type : String,
  description : String,
  created_at: Date,
  
});

var Report = mongoose.model('Reports', friendsSchema);
module.exports = Report;