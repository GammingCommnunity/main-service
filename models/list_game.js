const mongoose=  require('mongoose');
const DataLoader= require('dataloader');

const list_game= mongoose.Schema({
    name:{
      type:String,
      unique: true,
    },
    genres: [String],
    popularity: String,
    platforms:[String],
    tag:[String],
    logo: {
      imageUrl: String,
      //blur: String
    },
    images:[
       String
      //blur:String
    ],
    coverImage: {
      imageUrl: String,
      //blur: String
    },
    video:{
      trailer:{
        type:String
      },
      gameplay:[String]
    },
    summary:{
      type:String
    }
})
const ListGame= mongoose.model("ListGame",list_game);
const getListGameLoader = () => new DataLoader((gameID) => {
    //console.log(roomIDc);
    
    return ListGame.find({ _id: { $in: gameID }});
  })
module.exports = {ListGame,getListGameLoader};