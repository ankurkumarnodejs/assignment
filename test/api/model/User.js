// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// create a schema
var userSchema = new Schema({
  firstname: String,
  lastname: String,
  gender: String,
  username: { type: String, required: true, unique: true },
  age: String,
  phone: Number,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: Boolean, default: true },
  created_at: Date,
  updated_at: Date
});

userSchema.plugin(passportLocalMongoose);


// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;