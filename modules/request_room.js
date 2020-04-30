const { gql } = require('apollo-server');
module.exports = typeDef = gql`
 extend type Mutation{
    confirmUserRequest(hostID:String,userID:String,roomID:String):ResultCRUD
    cancelRequest(hostID:String,roomID:String, userID:String):ResultCRUD
 }
`