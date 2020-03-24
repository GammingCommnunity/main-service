const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const ChatPrivate = mongoose.Schema({
    _id:String,
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
            user: {
                id: String,
                profile_url: String
            },
            text:String,
            createAt:{
                type:Date,
                default:Date.now()
            }
        }
    ]
    
});
ChatPrivate.plugin(mongoosePaginate);
module.exports = mongoose.model('ChatPrivate', ChatPrivate);