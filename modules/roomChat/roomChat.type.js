const { gql } = require('apollo-server');
module.exports = typeDef = gql`
    type RoomMessageType{
        sender:String
        messageType: MessageTypeEnum
        text: TextType
        createAt:Date
    }

    type RoomChat{

        roomID: String
        member: [String]
        messages: [
            RoomMessageType
        ]
    }
`
//Custom!