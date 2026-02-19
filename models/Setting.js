
const mongoose = require('mongoose');
module.exports = mongoose.model('Setting', new mongoose.Schema({
  heroImages:[String],
  siteTitle:String,
  aboutText:String
}));
