const mongoose = require('mongoose');
const ChatPrivate = mongoose.Schema({
    hostID: String,
    messages:[
        {
            userID:String,
            text:String,
            createAt:{
                type:Date,
                default:Date.now()
            }
        }
    ]
    
})
module.exports = mongoose.model('ChatPrivate', ChatPrivate);