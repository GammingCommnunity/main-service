const ListGame = require('apollo-server');
module.exports = gameResolvers = {

    Query: {
        getListGame: async (root, { limit }) => {
            //return ListGame.create(input);
            if (limit == 1) {
                return await ListGame.find({}, {}, { slice: { 'images': 1 } }).lean(true).then((f) => {
                    //var v =  listGameLoader.load(f);
                    //console.log(listGameLoader.load(f));

                    const mapped = f.map(async (e) => {
                        var url = "";
                        return RoomBackground.findOne({ "gameID": e._id }).then((val) => {

                            try {
                                url = val.background.url;
                                return ({ ...e, "background": url })
                            } catch (error) {
                                return ({ ...e, "background": process.env.default_banner })
                            }

                        });

                    })
                    return mapped
                });
            }
            if (limit == 0) {
                return await ListGame.find({}, {}, { slice: { 'images': [1, 100] } }).lean(true).then((f) => {

                    const mapped = f.map(async (e) => {
                        var url = "";
                        return RoomBackground.findOne({ "gameID": e._id }).then((val) => {
                            url = val.background.url;
                            return ({ ...e, "background": url })
                        });
                    })
                    return mapped;

                });
            }

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
        countRoomOnEachGame: async (_, { sort }, context) => {
            return ListGame.find({}).select("name game").lean().then(async (v) => {
                console.log(v);

                let mapped = v.map(async (e) => {
                    var count = await Room.countDocuments({ "game.gameID": e._id });
                    var result = await RoomBackground.findOne({ "gameID": e._id });
                    return ({ ...e, "count": count, "background": result.background.url })

                })
                // convert from promise to fullfil
                let values = await Promise.all(mapped.map(async (e) => {
                    return e;
                }));

                if (sort == 'ASC') {
                    values.sort((a, b) => {
                        return b.count - a.count
                    });
                }
                //descending
                else if (sort == 'DESC') {
                    values.sort((a, b) => {
                        return a.count - b.count
                    });
                }
                return values;
            });
        },
        searchGame: async (_, { name, id }) => {
            let regex = new RegExp(name, 'i');
            if (name != "") {
                return ListGame.findOne({ $text: { $search: name } }).then((v) => {
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