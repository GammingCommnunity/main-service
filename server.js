const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const { MemcachedCache } = require('apollo-server-cache-memcached')
const mongoose = require('mongoose');
const { execute, subscribe } = require ('graphql');
const Schema = require('./schema');
const { createServer } =require ('http');
const express= require('express');
const  checkSession = require('./middleware/checkSession');
require('dotenv').config()
require('os').tmpdir();
const { SubscriptionServer } = require ('subscriptions-transport-ws');
const buildDataloaders = require('./src/dataloader');
const { Room, getRoomLoader } = require('./models/room');
const { ListGame, getListGameLoader } = require('./models/list_game');


const server = new ApolloServer({
    
    cors: true,
    schema: Schema,
    playground: true,
    introspection: true,
    persistedQueries: {
        cache: new MemcachedCache(
            ['memcached-server-1', 'memcached-server-2', 'memcached-server-3'],
            { retries: 10, retry: 10000 })
    },
    
    context: ({ req }) => {
        //const token = req.headers.token || null;
        return {
            dataloaders: {
                roomLoader: getRoomLoader(),
                listGameLoader: getListGameLoader()
            }
        };
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
// const WS_PORT = 5000;
// const websocketServer = createServer((request, response) => {
//     response.writeHead(404);
//     response.end();
// });

// // Bind it to port and start listening
// websocketServer.listen(WS_PORT, () => console.log(
//     `Websocket Server is now running on http://localhost:${WS_PORT}`
// ));
// const subscriptionServer = SubscriptionServer.create(
//     {
//         Schema,
//         execute,
//         subscribe,
//     },
//     {
//         server: websocketServer,
//         path: '/graphql',
//     },
// );
const port = process.env.PORT || 4000;
const app = express();
const path= '/graphql';
app.use(path,checkSession);
server.applyMiddleware({ app, path})
app.listen(port,() => {

    console.log(`🚀  Server ready at ${port}`);
    mongoose.Promise = global.Promise;
    mongoose.set('useFindAndModify', false);
    mongoose.set('debug', true);
    mongoose.connect(process.env.db_connection, { useUnifiedTopology: true, useNewUrlParser: true,useCreateIndex:true }, (res, err) => {
        console.log('Connected to MongoDB');
    })

});

/*const port = process.env.PORT || 4000;
const app = express();
const httpServer = http.createServer(app);
server.applyMiddleware({ app, path: '/', cors: true });

server.installSubscriptionHandlers(httpServer)
httpServer.listen({ port }, () => {
    console.log(
        `?? Server ready at http://localhost:${port}${server.graphqlPath}`
    );
    console.log(
        `?? Subscriptions ready at ws://localhost:${port}${
        server.subscriptionsPath
        }`
    );
    //console.log(`🚀  Server ready at ${url}`);
    mongoose.Promise = global.Promise;
    mongoose.set('useFindAndModify', false);
    mongoose.set('debug', true);
    mongoose.connect(process.env.db_connection, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }, (res, err) => {
        console.log('Connected to MongoDB');
    })
});
*/



