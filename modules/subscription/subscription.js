const {gql } = require('apollo-server');

module.exports= typeDef = gql`
     type Subscription{
        onJoinRoom(hostID:String): userSubscription
        recieveNewMessage:messageSubscription
        """
        *** only listen to new message from groupID
        """
        groupNewMessage(groupID:String):groupSubcription
    }
      type userSubscription{
        roomName:String
        userID:String
        joinTime:Date
        isApprove:Boolean
    }
    type messageSubscription{
        message:String
        senderID:String
        sendDate:Date
    }
    type groupSubcription{
        groupID:String
        senderID:String
        message:String
        sendDate:Date
    
    }
`;