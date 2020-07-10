const { ListGame } = require('../../models/list_game');
const { Room } = require('../../models/room');
const { getGameInfo } = require('../../service/gameService');
const { countRoomByGameID } = require('../../service/roomService');
const RoomBackground = require('../../models/room_background')
const _ = require('lodash');
module.exports = gameResolvers = {

    Query: {
        getListGame: async (root, { page, limit, sort }) => {

            return ListGame.aggregate([
                { $skip: page <= 1 ? 0 : (page * 10 - 10) },
                { $limit: limit },

            ]).then(async (v) => {
                var mapped = await Promise.all(mapped = _.map(v, async (value) => {
                    const countNum = await countRoomByGameID(value._id);
                    return _.assign({}, value, { count: countNum })
                }))
                return _.orderBy(mapped, ['count'], [sort.toLowerCase()])
            })

        },
        getGameByGenre: async (root, { type }, context) => {
            console.log("Token here", context.token);
            return ListGame.find({ "genres": { $regex: type, $options: 'i' } }).then((v) => {
                //console.log(v);
                return v;
            })
        },
        getSummaryByGameID: async (_, { gameID }) => {
            return ListGame.find({ "_id": gameID }).lean();
        },
        searchGame: async (_, { name, id }) => {
            let regex = new RegExp(name, 'i');
            if (name != "") {
                return ListGame.where('name').regex(new RegExp(`${name}`, 'i')).then(async (v) => {
                    console.log(v);

                    return v;
                }).catch((err) => {
                    console.log(err);

                })
            }
            return await getGameInfo(id);
        },
    },
    Mutation: {
        async createGame(root, { input }) {
            return ListGame.create(input).then((value) => {
                return onSuccess("Create game success!")
            }).catch((err) => {
                console.log(err);

                return onError('fail', "Create game failed!")
            });
        },
    }
}