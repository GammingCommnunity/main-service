const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const ChatPrivate = mongoose.Schema({
    
    currentUser: {
        id:String,
        profile_url:String
    },
    friend: {
        id: String,
        profile_url: String
    },
    messages:[
        {
            messageType: {
                type: String,
                required: true
            },
            id:String,
            text:{
                
            },
            createAt:{
                type:Date,
                default:Date.now()
            }
        }
    ]
    
}
);
ChatPrivate.plugin(mongoosePaginate);
module.exports = mongoose.model('chatPrivate', ChatPrivate);