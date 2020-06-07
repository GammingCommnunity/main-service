const { gql } = require('apollo-server');
module.exports = typeDef = gql`
    input Custom{
        content:String!
        publicID:String!
        height:Float
        width:Float
    }
    
    input MessageInput{
        messageType: MessageTypeEnum!
        text: Custom!
    }
    input RoomChatInput{
        roomID:String
        member:[
            String
        ]
        messages:[
            MessageInput
        ]
    }

`