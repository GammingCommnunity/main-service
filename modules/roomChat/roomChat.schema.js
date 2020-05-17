const { gql } = require('apollo-server');
module.exports = typeDef = gql`
    type Query{
        getAllRoomChat:[RoomChat]
        getRoomMessage(roomID:String!,page:Int!,limit:Int!):[RoomMessageType]
        getRoomChatInfo(roomID:String!):RoomChat
    }   
    extend type Mutation{
        createRoomChat(input:RoomChatInput):RoomChat
    }
`