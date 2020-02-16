const mongoose= require('mongoose')
const User=require('./user');
const Message= require('./message');
const globalRoom= mongoose.Schema({
    room_name:String,
    game_name:String,
    message:[{
        id_user:String,
        message:String,
        image:String
    }]
})
module.exports= mongoose.model('GlobalRoom',globalRoom);