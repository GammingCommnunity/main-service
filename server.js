const { ApolloServer,AuthenticationError } = require('apollo-server');
const {verify} =  require('jsonwebtoken');
//const express = require('express');
const mongoose= require('mongoose');

const Schema = require('./schema');
//const app = express();
require('dotenv').config()
const cors = require('cors');
//app.use(cors());
require('os').tmpdir();
const buildDataloaders= require('./src/dataloader');
const {Room,getRoomLoader}= require('./models/room');
const {ListGame,getListGameLoader}= require('./models/list_game');
const {Logger,MongoClient} = require('mongodb');
const server = new ApolloServer({
    
    cors:true,
    schema: Schema,
    playground: false,
    introspection: true,
    cacheControl:{defaultMaxAge:10},
   
    context:({req})=>{
     
       const token =req.headers.token || null;
      
       
       
       return {token,dataloaders:{
            roomLoader: getRoomLoader(),
            listGameLoader:getListGameLoader()}};
       //console.log(process.env.SECRET_KEY);
       /*if(!token){
            throw new AuthenticationError('No token provided !');
           
       }
       else{
        try {
            let result= verify(token,process.env.SECRET_KEY);
            //check id_user == result.id_user
            if(result) return {token};
           } catch (error) {
            throw new AuthenticationError("There is problem with your Token, please check again ... ")
           }
       }*/

    }
    
});

server.listen().then(({ url }) => {
   
    console.log(`🚀  Server ready at ${url}`);
    mongoose.Promise = global.Promise;
    mongoose.set('useFindAndModify', false);
    mongoose.set('debug',true);
    mongoose.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true }, (res, err) => {

        console.log('Connected to MongoDB');
    })
  
    
});






