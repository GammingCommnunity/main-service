const privateChatInput = require('./privateChat.input');
const privateChatSchema = require('./privateChat.schema');
const privateChatType = require('./privateChat.type');
const privateChatResolvers = require('./privateChat.resolvers');
module.exports = {
    PrivateChatModule: () => [
        privateChatInput, privateChatType, privateChatSchema
    ],
    PrivateChatResolvers:  privateChatResolvers
}