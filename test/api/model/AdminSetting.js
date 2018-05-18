// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var adminSettingSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: Boolean, default: true },
  Settings: Array,
  created_at: Date,
  updated_at: Date
});


// the schema is useless so far
// we need to create a model using it
var AdminSetting = mongoose.model('AdminSetting', adminSettingSchema);

// make this available to our users in our Node applications
module.exports = AdminSetting;