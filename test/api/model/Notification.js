// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('../model/Customer.js');

// create a schema
var notificationSchema = new Schema({  
  FromId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  ToId:{ type: Schema.Types.ObjectId, ref: 'Customer' },
  title : {type: String},  
  isread : {type: Boolean, default: false},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
  });

// the schema is useless so far
// we need to create a model using it
var Notification = mongoose.model('Notificatios', notificationSchema);

// make this available to our users in our Node applications
module.exports = Notification;