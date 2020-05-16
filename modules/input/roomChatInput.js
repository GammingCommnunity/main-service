const { gql } = require('apollo-server');
module.exports = typeDef = gql`
    input Custom{
        content:String
        height:Float
        width:Float
    }
    
input MessageInput{
    messageType: MessageType
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