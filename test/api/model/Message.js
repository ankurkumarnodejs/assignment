// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var messageSchema = new Schema({
  fromCustId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  toCustId:{ type: Schema.Types.ObjectId, ref: 'Customer' },
  message : String,
  toSocketId : String,
  fromSocketId : String,  
  created_at: Date,
  isread : { type: Boolean, default: false },
  created_at : { type: Date, default: Date.now }  
});

var message = mongoose.model('Message', messageSchema);
// make this available to our users in our Node applications
module.exports = message;