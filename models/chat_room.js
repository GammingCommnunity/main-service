const mongoose= require('mongoose');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const mongoosePaginate = require('mongoose-paginate-v2');

const roomChat= mongoose.Schema({
    roomID: {
        type: ObjectId,
    },
    member:[String],
    messages:[
        {
            userID:String,
            text:String,
            createAt:{ 
                type: Date, 
                default: Date.now }
        }   
    ],
    createAt:{
        type:Date,
        default:Date.now()
    }
    
})
roomChat.plugin(mongoosePaginate);
module.exports= mongoose.model('roomChat',roomChat);