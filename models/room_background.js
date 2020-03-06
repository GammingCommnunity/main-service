const mongoose = require('mongoose');

const RoomBackground= mongoose.Schema({

    name:{
        type: String,
        unique:true
    },
    gameID:String,
    background:{
        url:String,
        blur:String
    }
})

module.exports = mongoose.model('roomBackground',RoomBackground);