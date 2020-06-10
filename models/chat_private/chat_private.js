const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const messageSchema = mongoose.Schema({
    id: String,
    messageType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "SEND"
    },
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
        default: Date.now()
    }

})

const ChatPrivate = mongoose.Schema({
    host:String,
    member: [String],
    messages: [
        messageSchema
    ]

});
ChatPrivate.virtual('chatID').get(function () {
    return this._id;
});
messageSchema.plugin(aggregatePaginate);
ChatPrivate.plugin(aggregatePaginate);
module.exports = mongoose.model('chatPrivate', ChatPrivate);