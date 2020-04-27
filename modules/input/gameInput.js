const { gql } = require('apollo-server');
module.exports = typeDef = gql`
 input ProfileInput{
        id:String
        profile_url:String
    }

    input VideoInput{
        trailer:String!,
        gameplay:String
    }

    input ImageInput{
        imageUrl: String,
        blur: String
    }
 input GameInput{
        _id:ID
        name:String! 
        genres:[Genres]
        platforms:[Platforms]
        popularity:String
        tag:[String]
        banner:String
        logo:ImageInput
        images:[
            String
        ]
        coverImage:ImageInput
        summary:String
        video:VideoInput

    }
 
`