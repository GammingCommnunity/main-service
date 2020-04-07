const Interface= {
    MutationResponse: {
        __resolveType(mutationResponse, context, info) {
            return null;
        },
    },
    AuthResponse: {
        __resolveType(AuthResponse, context, info) {
            return null;
        },
    },
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