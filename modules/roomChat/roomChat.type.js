const { gql } = require('apollo-server');
module.exports = typeDef = gql`
    type RoomMessageType{
        _id:ID
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