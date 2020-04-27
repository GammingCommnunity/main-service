const { gql } = require('apollo-server');
module.exports = typeDef = gql`
    type TextMessageType{
        content: String
        height: Float
        width: Float
    }
`