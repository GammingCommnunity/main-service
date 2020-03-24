const mongoose = require('mongoose');

const searchHistory = mongoose.Schema({
    userID:String,
    history:[String]
})
module.exports = mongoose.model("searchHistory",searchHistory);