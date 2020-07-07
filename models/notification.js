const mongoose = require('mongoose');
const mongooseAggregate = require('mongoose-aggregate-paginate-v2');

const notification = mongoose.Schema({
    creator: String,
    content: String,
    to: String,
    haveSeen: {
        type: Boolean,
        default: false
    },
    time: {
        type:Date,
        default:Date.now()
    },

})
notification.plugin(mongooseAggregate);
module.exports = mongoose.model('notification', notification);