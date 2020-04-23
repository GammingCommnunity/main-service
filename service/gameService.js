const {ListGame} = require('../models/list_game');
module.exports = {
    getGameInfo : async (id) => {
        return await ListGame.findById(id).catch((err)=>{
            return null;
        });
    },
    
    
}