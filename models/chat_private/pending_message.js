const mongoose = require('mongoose');
const mongoose_paginate = require('mongoose-paginate-v2');
const PendingMessage = mongoose.Schema({

    userID: String,
    messages: [
        {
            text: String,
            createAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    createAt: {
        type: Date,
        default: Date.now()
    }
    
});
PendingMessage.plugin(mongoose_paginate);
module.exports = mongoose.model("pending_messages",PendingMessage);
