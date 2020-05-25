const { gql } = require('apollo-server');
module.exports = typeDef = gql`

extend type Query{
   manageRequestJoin_Host:[ApproveList]
   getPendingJoinRoom_User:[ApproveList]
}
 extend type Mutation{
    acceptUserRequest(requestID:String,roomID:String):ResultCRUD
    cancelRequest(roomID:String, requestID:String):ResultCRUD
 }
`