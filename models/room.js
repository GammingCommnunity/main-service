const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const DataLoader= require('dataloader');
const Rooms = mongoose.Schema({
  roomName: {
    type:String,
    unique: true,
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  game: {
    gameID: String,
    gameName: String,
    platform:String
  },
  description: {
    type:String,
    default:""
  },
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

Rooms.plugin(mongoosePaginate);
const getRoomLoader = () => new DataLoader((roomID) => {
  //console.log(roomIDc);
  
  return Room.find({ _id: { $in: roomID }});
})
const Room= mongoose.model('roomList', Rooms);
module.exports = {Room,getRoomLoader};
