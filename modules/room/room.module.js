const roomSchema = require('./room.schema');
const roomInput = require('./room.input');
const roomResolvers = require('./room.resolvers');
module.exports = {
    RoomModule: () => [roomSchema, roomInput],
    RoomResolvers :  roomResolvers
}