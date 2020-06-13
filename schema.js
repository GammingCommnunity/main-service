const { makeExecutableSchema } = require('apollo-server-express');
const Resolvers = require('./resolver');
const Scalar = require('./modules/scalar/custom_scalar');
const Enum = require('./modules/enum/enum');
const ResultCRUD = require('./modules/type/crud_result');

const {SubscriptionModule,SubscriptionResolvers } = require('./modules/subscription/subscription.module');

const { GameModule, GameResolvers } = require('./modules/Game/game.module');
const { PrivateChatModule, PrivateChatResolvers } = require('./modules/privateChat/privateChat.module');
const { RoomChatModules, RoomChatResolvers } = require('./modules/roomChat/roomChat.module');
const { RoomModule, RoomResolvers } = require('./modules/room/room.module')
const { RequestModule, RequestResolvers } = require('./modules/request/request.module');
const schema = makeExecutableSchema({

    typeDefs: [
        //typeDefs,
        Scalar,
        Enum,
        ResultCRUD,
        SubscriptionModule,
        GameModule,
        PrivateChatModule,
        RoomChatModules,
        RoomModule,
        RequestModule,
        
    ],

    resolvers:
        [
            //Resolvers,
            
            SubscriptionResolvers,
            GameResolvers,
            PrivateChatResolvers,
            RoomChatResolvers,
            RoomResolvers,
            RequestResolvers,
            
        ],

});
module.exports = schema;
