const { Room} = require('../models/room');
module.exports ={
    checkHost : async(roomID, userID)=>{
        const result = await Room.findOne({"_id":roomID,"hostID":userID}).countDocuments();
        if(result > 1){
            return false;
        }
        else{
            return true;
        }
    }
}