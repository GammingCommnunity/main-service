const mongoose= require('mongoose')
const User= require('./user')
const mongoosePaginate = require('mongoose-paginate-v2');

const message= mongoose.Schema({
    message:String,
    datetime:String
})
const listMessage= mongoose.Schema({
    username:String,
    listmessage:[message]
        

})
listMessage.plugin(mongoosePaginate);
module.exports= mongoose.model('listmessage',listMessage);