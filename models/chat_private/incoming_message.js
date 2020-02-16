const mongoose = require('mongoose');
const mongoose_paginate= require('mongoose-paginate-v2');
const IncommingMessage = mongoose.Schema({   
        friendID: String,
        messages: [{
            text: String,
            createAt: {
                type: Date,
                default: Date.now()
            }
        }],
        createAt: {
            type: Date,
            default: Date.now()
        }
    
})
IncommingMessage.plugin(mongoose_paginate);
module.exports = mongoose.model("incomming_messages",IncommingMessage);
