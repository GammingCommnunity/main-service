const {gql } = require('apollo-server');

module.exports= typeDef = gql`
     type Subscription{
        """
        *** lắng nghe thông báo khi có người join group của bạn
        """
        joinRoomNotification: userSubscription
        """
        *** lắng nghe thông báo khi có chủ phòng chấp nhận request của bạn
        """
        acceptRequest:requestSubscription
        recieveNewMessage:messageSubscription
        """
        *** only listen to new message from groupID
        """
        groupNewMessage(groupID:String):groupSubcription
    }
       type requestSubscription{
        message:String
        time:Date
    }
      type userSubscription{
        type:Int
        roomID:String
        roomName:String
        hostID:String
        requestID:String
        joinTime:Date
        message:String
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