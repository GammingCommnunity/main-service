const privateChatInput = require('./privateChat.input');
const privateChatSchema = require('./privateChat.schema');
const privateChatType = require('./privateChat.type');
const privateChatEnum = require('./privateChat.enum');
const privateChatResolvers = require('./privateChat.resolvers');
module.exports = {
    PrivateChatModule: () => [
        privateChatInput, privateChatType, privateChatSchema, privateChatEnum
    ],
    PrivateChatResolvers:  privateChatResolvers
}