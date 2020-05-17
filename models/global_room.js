const mongoose= require('mongoose')
const User=require('./user');
const Message= require('./message');
const globalRoom= mongoose.Schema({
    roomName:String,
    gameName: String,
    gameID:String,
    message:[{
        userID:String,
        message: {
            messageType:String,
            content:String,
            height: {
                type: Number,
                default:0
            },
            width: {
                type: Number,
                default: 0
            }
        }
    }]
})
module.exports= mongoose.model('GlobalRoom',globalRoom);