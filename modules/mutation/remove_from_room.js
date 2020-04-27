const { gql } = require('apollo-server');

module.exports = mutation = gql`
 extend type Mutation{
    RmvMbFrRoom(type:String!,userID:String,roomID:String):ResultCRUD
 }
`