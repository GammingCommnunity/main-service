const mongoose=  require('mongoose');
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
module.exports = mongoose.model("ListGame",list_game);