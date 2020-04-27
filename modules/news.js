const { gql } = require('apollo-server');
module.exports = typeDef = gql`
     type News{
        article_url:String,
        article_short:String,
        article_image:String,
        release_date:String
    }
    extend type Query{
        fetchNews(name:String!,page:Int,limit:Int):[News]
    }
`