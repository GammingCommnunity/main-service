const { gql } = require('apollo-server');
module.exports = typeDef = gql`
 extend type Mutation{
    confirmUserRequest(hostID:String,userID:String):ResultCRUD
    cancelRequest(roomID:String, userID:String):ResultCRUD
 }
`