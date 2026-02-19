
const mongoose = require('mongoose');
module.exports = mongoose.model('Item', new mongoose.Schema({
  name:String,
  description:String,
  price:Number,
  image:String,
  section:{type:mongoose.Schema.Types.ObjectId,ref:'Section'}
}));
