const mongoose=  require('mongoose');
const DataLoader= require('dataloader');

const list_game= mongoose.Schema({
    game_name:String,
    genres: [String],
    popularity: String,
    platforms:[String],
    tag:[String],
    logo:String,
    image:[String],
    cover_image:String
})
const ListGame= mongoose.model("ListGame",list_game);
const getListGameLoader = () => new DataLoader((gameID) => {
    //console.log(roomIDc);
    
    return ListGame.find({ _id: { $in: gameID }});
  })
module.exports = {ListGame,getListGameLoader};