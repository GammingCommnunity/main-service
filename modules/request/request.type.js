const { gql, AuthenticationError } = require('apollo-server');

module.exports = typeDef = gql`
    type ApproveList{
        _id: ID
        requestID: String
        roomID: String
        isApprove: Boolean
        joinTime: Date
    }
`
