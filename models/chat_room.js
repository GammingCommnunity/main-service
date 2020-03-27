const mongoose= require('mongoose');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const mongoosePaginate = require('mongoose-paginate-v2');

const roomChats= mongoose.Schema({
    roomID: String,
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
roomChats.plugin(mongoosePaginate);
module.exports= mongoose.model('roomChat',roomChats);