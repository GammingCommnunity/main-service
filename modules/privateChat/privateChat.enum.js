const { gql } = require('apollo-server');
module.exports = typeDef = gql`
    enum MessageTypeEnum{
        text
        media
    }
    enum MessageStatusEnum{
        SEND,
        RECEIVED
    }

`