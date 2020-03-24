const mongoose = require('mongoose');
const DataLoader = require('dataloader');
const RoomBackground = require('./room_background');
const list_game = mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  genres: [String],
  popularity: String,
  platforms: [String],
  tag: [String],
  logo: {
    imageUrl: String,
    //blur: String
  },
  images: [
    String
    //blur:String
  ],
  banner: {
    type: String,
  },
  coverImage: {
    imageUrl: String,
    //blur: String
  },
  video: {
    trailer: {
      type: String
    },
    gameplay: [String]
  },
  summary: {
    type: String
  },
  background:String|null

})
const ListGame = mongoose.model("ListGame", list_game);
const getListGameLoader = () => new DataLoader(async (listGame) => {
  
  /*return RoomBackground.findOne({"gameID":gameID}).then((v)=>{
    return v.background.url
    
  })*/
  //return ListGame.find({ _id: { $in: gameID }});

})
list_game.index({name:"text"})

module.exports = { ListGame, getListGameLoader };