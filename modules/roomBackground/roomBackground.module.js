const roomBGSchema = require('./roomBG.schema');
const roomBGInput = require('./roomBG.input');
const roomBGResolvers = require('./roomBG.resolvers');
module.exports = {
    RoomBGModule: () => [roomBGSchema, roomBGInput],
    RoomBGResolvers: roomBGResolvers
}