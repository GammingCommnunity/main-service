const privateChatModel = require('../../../models/chat_private/chat_private');
module.exports = {
    deletePrivateChat: (userID) => {
        // check if 
        return privateChatModel.deleteOne({})
    }

}
