const gameSchema = require('./game.schema');
const gameInput = require('./game.input');
const gameResolvers = require('./game.resolvers');
module.exports = {
    GameModule: function () {
        return [gameSchema, gameInput]
    },
    GameResolvers:  gameResolvers
}