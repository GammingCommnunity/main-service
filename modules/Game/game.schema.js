const { gql } = require('apollo-server');
module.exports = typeDefs = gql`
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
    type Game{
        _id:ID!
        name:String
        genres:[String]
        platforms:[String]
        popularity:String
        logo:ImageType
        images(limit:Int):[String]
        tag:[String]
        banner:String
        coverImage:ImageType
        summary:String
        video:VideoType
        background:String
        count:Int
    }
    extend type Query{
        """
            ***Tìm kiếm game theo tên hoặc theo id game***
        """
        searchGame(name:String,id:String):[Game]
        """
        *** Liệt kê tóm tắt các game channel  ***
        """
        getListGame(page:Int!,limit:Int!,sort:SortEnum! = ASC):[Game]
        getGameByGenre(type:String!):[Game]
        """
        *** Lấy thông tin về game **
        """
        getGameInfo(gameID:String!):Game
    }
    extend type Mutation{
        """
            ***Create  a game with 'input'***
        """
        createGame(input:GameInput):ResultCRUD
    }
`