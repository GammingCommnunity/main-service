const { gql } = require('apollo-server');
module.exports = typeDef = gql`
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
        count(DESC:String):Int
    }
    extend type Query{
        """
            *** Search game by name or by id (specify one of them)***
        """
        searchGame(name:String,id:String):Game
        """
        *** Get all game 
            spectify limit to get exactly values u want    ***
        """
        getListGame(limit:Int!):[Game]
        getGameByGenre(type:String!):[Game]
        getSummaryByGameID(gameID:String!):[Game]
        countRoomOnEachGame(sort:SortEnum!):[Game]
    }

`