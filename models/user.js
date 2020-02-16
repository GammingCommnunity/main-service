const mongoose= require('mongoose');

const User= mongoose.Schema({
    username:String,
    avatar:String,
    isHost:{
      type:Boolean,
      default: false
    },
    cover:String,
    blacklist:[String]
})
module.exports = mongoose.model('user',User);