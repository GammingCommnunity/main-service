const { gql } = require('apollo-server');
module.exports = typeDef = gql`
    type TextType{
        content: String
        height: Float
        width: Float
    }
    type PrivateMessagesType{
        id: String
        messageType: MessageTypeEnum
        status: MessageStatusEnum
        text: TextType
        createAt: Date
    }
`