const { gql } = require('apollo-server');
module.exports = typeDef = gql`
    input Custom{
        content:String
        height:Float
        width:Float
    }
    
input MessageInput{
    messageType: MessageType
    id: String
    text: Custom!
    createAt: Date
}
 input RoomChatInput{
        roomID:String
        member:[
            String
        ]
        messages:[
            MessageInput
        ]
        createAt:Date
    }

`