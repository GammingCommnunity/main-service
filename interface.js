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
    ResultTest: {

        __resolveType(obj, context, info) {

            if (obj.room_name) {
                console.log(obj);
                return Room.find().then((v) => {
                    return v;
                });
            }
            if (obj.game_name) {
                return ListGame.find().then((v) => {
                    return v;
                });
            }
            return null;
        }
    },
}
module.exports = Interface;