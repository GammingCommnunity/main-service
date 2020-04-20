const { Room} = require('../models/room');
module.exports ={
    checkHost : async(roomID, userID)=>{
        const result = await Room.find({"_id":roomID,"hostID":userID}).countDocuments();
        console.log(result);
        
        if(result > 0){
            return true;
        }
        else{
            return false;
        }
    },
    getRoomInfo: async(roomID) =>{
        //const result = await Room.aggregate([{ $match: { "_id": mongoose.Types.ObjectId(roomID) }, }]);
        const result = await Room.findOne({"_id":roomID});
        return result;
    }
}