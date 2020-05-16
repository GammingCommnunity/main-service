const { gql } = require('apollo-server');
module.exports = typeDef = gql`
    input PrivateChatInput {
        friendID:String!
    }
`