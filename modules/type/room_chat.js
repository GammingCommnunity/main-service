const { gql } = require('apollo-server');
module.exports = typeDef = gql`
type RoomChat{

    roomID: String
    member: [String]
    messages: [
        RoomMessage
    ]
}
`

