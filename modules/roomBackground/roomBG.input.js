const { gql } = require('apollo-server');
module.exports = typedef = gql`
    input RoomBackgroundInput{
        name:String!,
        gameID:String,
        background:BackgroundInput
    }
    input BackgroundInput{
        url:String,
        blur:String
    }
    
`