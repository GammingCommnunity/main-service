const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const mongoosePaginate = require('mongoose-paginate-v2');

const roomChats = mongoose.Schema({
    roomID: String,
    member: {
        type: [String],
        unique: true
    },
    background: String,
    messages: [
        {
            sender: String,
            messageType: String,
            reactions: [
                {
                    userID: String,
                    reactionType: String,
                } 
            ],
            text: {
                content: String,
                fileInfo: {
                    fileName: String,
                    fileSize:String,
                    publicID: String,
                    height: {
                        default: 0,
                        type: Number
                    },
                    width: {
                        default: 0,
                        type: Number
                    }
                }
                
            },
            createAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createAt: {
        type: Date,
        default: Date.now()
    }

})
roomChats.plugin(mongoosePaginate);
module.exports = mongoose.model('roomChat', roomChats);