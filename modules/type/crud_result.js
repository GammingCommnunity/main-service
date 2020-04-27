const { gql } = require('apollo-server');
module.exports = typeDef = gql`
  type ResultCRUD{
        status:Int
        payload:String
        success:Boolean!
        message:String!
        
    }
  
`;