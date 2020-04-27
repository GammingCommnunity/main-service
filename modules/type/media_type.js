const { gql } = require('apollo-server');
module.exports = typeDef = gql`
    type Media{
        text:String,
        createAt:Date
    }
    type ImageType{
        imageUrl: String,
        blur: String
    }
    type VideoType{
        trailer:String
        gameplay:[String]
    }
`;