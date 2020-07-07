const { PubSub, PubSubEngine, withFilter } = require('apollo-server');
const pubsub = new PubSub();

module.exports = resolvers = {
    Subscription: {

        joinRoomNotification: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('JOIN_ROOM'),
                (payload, variable, context) => {
                    return payload.joinRoomNotification.hostID === context.currentUser
                    // if (payload.joinRoomNotification.type == 1) {
                    //     // user notfication
                    //     return payload.joinRoomNotification.hostID === context.currentUser
                    // }
                    // else return payload.joinRoomNotification.hostID === context.currentUser
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