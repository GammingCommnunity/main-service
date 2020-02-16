const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Room = mongoose.Schema({
  roomName: String,
  isPrivate: {
    type: Boolean,
    default: false
  },
  game: {
    gameID: String,
    gameName: String
  },
  description: String,
  maxOfMember: {
    type:Number,
    default:1
  },
  hostID: String,
  member: [String],
  blacklist: [String],
  createAt:{
    type:Date,
    default:Date.now()
  }
})
Room.plugin(mongoosePaginate);
module.exports = mongoose.model('roomList', Room);
