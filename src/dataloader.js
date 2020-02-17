const DataLoader = require('dataloader');
//const Room = require('../models/room');
async function batchListRoom (keys,Room){
    console.log(keys);

    return await Room.find({_id:{$in:keys}}); 
}
module.exports = ({Room})=>({
    roomLoader: new DataLoader(
        keys=>batchListRoom(keys,Room)
        
    )
})