const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate-v2');
require('dotenv').config()
var db2 = mongoose.createConnection(process.env.db_connection2);
const News= mongoose.Schema({
    id:{
        type:Number
    },
    article_url:String,
    article_short:String,
    article_image:String,
    release_date:String

})
News.plugin(mongoosePaginate);
module.exports = db2.model('news', News);