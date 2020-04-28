const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const DataLoader = require('dataloader');
require('dotenv').config();
var roomLogo = process.env.default_logo;
var roomBackground = process.env.default_background
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
  },
  roomLogo: {
    type: String,
    default: roomLogo
    
  },
  roomBackground: {
    type: String,
    default: roomBackground
  },
  code:{
    type:String,
    default:""
  },
  pendingRequest:[String]
})

Rooms.plugin(mongoosePaginate);
const getRoomLoader= () => new DataLoader(
  (userID,roomID) => {
    return Room.aggregate([{ $match: { "member": userID, "hostID": { $ne: userID }, "_id": roomID } }]);
  }
)
const Room= mongoose.model('roomList', Rooms);
module.exports = {Room,getRoomLoader};
