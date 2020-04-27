const { gql } = require('apollo-server');
module.exports = typeDef = gql`
    input Info{
        hostID: String!
        userID: String!
        roomID: String!
    }
`

