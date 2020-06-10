const { gql } = require('apollo-server');
module.exports = typeDef = gql`
    input FileInfoInput{
        fileName:String
        fileSize:String
        publicID:String!
        height:Float
        width:Float
    }
    input Custom{
        content:String!
        fileInfo:FileInfoInput
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