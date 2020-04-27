const Interface= {
    Message:{
        __resolveType(AuthResponse, context, info) {
            return null;
        },
    },
    gameInfo:{
        __resolveType(AuthResponse, context, info) {
            return null;
        },
    },

    TextMessage:{
        __resolveType(Message, context, info) {
            return null;
        },
    }
}
module.exports = Interface;