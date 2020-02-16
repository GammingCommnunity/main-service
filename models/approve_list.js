const mongoose = require('mongoose');
const ApproveList= mongoose.Schema({
    joinTime:{
        type:Date,
        default:Date.now
    },
    hostID:{
        type:String,
        default:""
    },
    userID:{
        type:String,
        default:""
    },
    roomID:{
        type:String,
        default:""
    },
    isApprove:{
        type:Boolean,
        default:false
    }
    
})
module.exports = mongoose.model("approveList",ApproveList);