const mongoose = require('mongoose');
const ChatPrivate = mongoose.Schema({
    currentUserID: String,
    friendID:String,
    messages:[
        {
            ID:String,
            text:String,
            createAt:{
                type:Date,
                default:Date.now()
            }
        }
    ]
    
})
module.exports = mongoose.model('ChatPrivate', ChatPrivate);