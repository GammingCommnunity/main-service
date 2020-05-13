const { gql } = require('apollo-server');
module.exports = typeDef = gql`
 extend type Mutation{
    confirmUserRequest(hostID:String,requestID:String,roomID:String):ResultCRUD
    cancelRequest(hostID:String,roomID:String, requestID:String):ResultCRUD
 }
`