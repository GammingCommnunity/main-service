const { gql } = require('apollo-server');
module.exports = typeDef = gql`
    
    type PrivateMessagesType{
        id: String
        messageType: MessageTypeEnum
        status: MessageStatusEnum
        text: TextType
        createAt: Date
    }
    type TextType{
        content: String
        fileInfo:FileInfoType
    }
    type FileInfoType{
        fileName:String
        fileSize:String
        publicID:String
        height: Float
        width: Float
    }
   
`