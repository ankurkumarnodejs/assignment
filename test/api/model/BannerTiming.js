var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var BannerSchema = new Schema({
    bannertiming: []
});

var Banner = mongoose.model('BannerTiming', BannerSchema);

module.exports = Banner;