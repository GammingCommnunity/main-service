const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const { MemcachedCache } = require('apollo-server-cache-memcached')
const Schema = require('./schema');
const { createServer } = require('http');
const express = require('express');
const checkSession = require('./middleware/checkSession');
const cors = require('cors');
const env = require('./env');
const serverService = require('./service/serverService');
const authService = require('./service/authService');
const { PubSub, PubSubEngine, withFilter } = require('apollo-server');
const pubsub = new PubSub()

/*const { SubscriptionServer } = require('subscriptions-transport-ws');
const buildDataloaders = require('./src/dataloader');
const { Room, getRoomLoader } = require('./models/room');
const { ListGame, getListGameLoader } = require('./models/list_game');*/


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

    context: async ({ req, res, connection }) => {
        var redis = serverService.initRedisServer();
        if (connection) {            
            return connection.context;
        }
        else {
            const token = req.headers.token || null;
            const authCode = req.headers.auth_code;
            if (token == null && authCode == env.main_server_code) {
                return {
                    token: ""
                }
            }
            else {
                const errorInfo = {
                    "message": "Wrong token!",
                    "status": "400"
                }
                var info = JSON.parse(res.info);

                if (info.status != "SUCCESSFUL") {
                    return res.json(errorInfo)
                }
                return {
                    authInfo: info.data,
                    token: token,
                    redis: redis
                };
            }
        }
        
    },
    subscriptions: {
        onConnect: async (connectionParams, webSocket) =>{
            var accountID = await authService(connectionParams.token);
            console.log('Websocket CONNECTED');
            
            return accountID; 
        },
        onDisconnect: () => console.log('Websocket disconnect '),
    }

});


const port = process.env.PORT || 4000;
const app = express();

app.use(cors())
app.use(checkSession);
server.applyMiddleware({ app, path: "/graphql" })
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);
httpServer.listen(port, () => {
    //serverService.initRedisServer();
    serverService.initMongoDBServer();
    serverService.initSocketServer(env.main_server_code);
    console.log(`?? Server ready at http://localhost:${port}${server.graphqlPath}`);
    console.log(`?? Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`);

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
    //console.log(`??  Server ready at ${url}`);
    mongoose.Promise = global.Promise;
    mongoose.set('useFindAndModify', false);
    mongoose.set('debug', true);
    mongoose.connect(process.env.db_connection, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }, (res, err) => {
        console.log('Connected to MongoDB');
    })
});
*/



