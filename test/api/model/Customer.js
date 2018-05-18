// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// create a schema
var customerSchema = new Schema({
  firstname: String,
  lastname: String,
  name: String,
  phone: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateofbirth: String,
  sexualorient : String,
  interests : [],
  profilePic: String,
  profileVideo:String,
  videolinks: [],
  steps: [],
  age:String,
  gender:String,
  preferences:{},
  friends:Array,
  friendsRequests:Array,
  blockedUsers:Array,
  visitors:[{ type: Schema.ObjectId, ref: 'Customer' }],
  invitedUsers:Array,
  myPhotos:Array,
  myPoints:Number,
  packagesPurchased:Array,
  remaincalls : {type : Number, default : 0},
  Role: {
        type: String,
        enum : ['Admin','User'],
        default: 'Admin'
    },
  Status:	Boolean,
  created_at: Date,
  updated_at: Date,
  /*mypackage : {},*/
  online : String,
  socketId : String,
  tokboxsessionid : String,
  tokboxtoken : String,
  description : String,
  islive : Boolean,
  speedstatus : Boolean,
  isbusy : Boolean,
  activate : {type : Boolean, default : false},
  featured : {type : Boolean, default : false},
  country: { type: Schema.ObjectId, ref: 'Country' },
  isprivate : {type : Boolean, default : false},
  isbusyspeed : {type : Boolean, default : false},
  isbusyvideo : {type : Boolean, default : false},
  cityName:String,
  countryName:String,
  lat:String,
  lng:String,
  height : String, 
  haircolor : String,
  bodyshape : String,
  maritalStatus : {type : Boolean, default : false},
  haveChildren : {type : Boolean, default : false},
  smoke : String,
  drink : String,
  qualification : String,
  profession : String,
  profilePercent: String,
  interestedin : String,
  profileCompletePercent : String
});

customerSchema.plugin(passportLocalMongoose);

// the schema is useless so far
// we need to create a model using it
var Customer = mongoose.model('Customer', customerSchema);

// make this available to our users in our Node applications
module.exports = Customer;