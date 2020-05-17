const { PubSub, PubSubEngine, withFilter } = require('apollo-server');
module.exports = resolvers = {
    Subscription: {

        onJoinRoom: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([JOIN_ROOM]),
                (payload, variable) => {
                    if (variable.onJoinRoom.type == 1) {
                        // user notfication

                    }
                    else return payload.onJoinRoom.hostID === variable.hostID
                }
            )
        },
        recieveNewMessage: {
            subscribe: () => pubsub.asyncIterator([RECIEVE_MESSAGE])
        },
        groupNewMessage: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([GROUP_MESSAGE]), (payload, variable) => {
                    return payload.groupNewMessage.groupID === variable.groupID
                }
            )
        }
    },
}