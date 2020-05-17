const roomChatInput = require('./roomChat.input');
const roomChatSchema = require('./roomChat.schema');
const roomChatType = require('./roomChat.type')
const roomChatResolvers = require('./roomChat.resolvers');
module.exports = {
    RoomChatModules : () => [roomChatInput, roomChatSchema,roomChatType],
    RoomChatResolvers: roomChatResolvers
}