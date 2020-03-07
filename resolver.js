
const { Room } = require('./models/room')
const RoomChat = require('./models/chat_room');
const { ListGame } = require('./models/list_game');
const ChatPrivate = require('./models/chat_private/chat_private');
const ApporoveList = require('./models/approve_list');
const RoomBackground = require('./models/room_background');
const { GraphQLUpload } = require('graphql-upload');
const Date = require('./custom-scalar/Date.scalar');
require('dotenv').config();
const path = require('path');
const { AuthenticationError } = require('apollo-server')
const { sign, verify } = require('jsonwebtoken');
var cloudinary = require('cloudinary').v2;
const { AuthResponse, Message, MutationResponse, ResultTest } = require('./interface');
const { Genres, Platforms } = require('./src/enum');
const News= require('./models/news');
module.exports = resolvers = {
    Upload: GraphQLUpload,
    Date: Date,
    AuthResponse, Message, MutationResponse, ResultTest,
    //import enum type here
    Genres, Platforms,
    Query: {

        generateToken: async (_, { id }) => {
            var token = sign({
                id_user: id,
                role: "User"
            }, process.env.SECRET_KEY, { expiresIn: "7d" });
            return token;
        },

        async getAllRoom(_, { page, limit }, { token, dataloaders: { roomLoader } }) {


            //roomLoader.load("5e46bcba3660fe0c1811c209")
            // if (!token) {
            //     console.log("No access token provided !")
            //     throw new AuthenticationError("No access token provided !")
            // }
            // else 

            return Room.paginate({}, { page: page, limit: limit, }).then((v) => {
                for (const iterator of v.docs) {
                    roomLoader.load(iterator._id);
                }

                return v.docs;
            }).catch((e) => {
                return null;
            })
        },
        async getPrivateChat(root, { ID }) {
            // cond 1: ID is the host
            return ChatPrivate.find({
                $and: [
                    { $or: [{ "currentUser.id": ID }, { "friend.id": ID }] },
                ]
            }).then(async (v) => {
                return v

            })/*.catch(async (err) => {
                // cond 2: ID is the guest
                return ChatPrivate.find({ $in: { "friendID": ID } }).then((v) => {
                    return v;
                })

            });*/

        },

        async getAllRoomChat() {
            return await RoomChat.find();
        },



        async RmvMbFrRoom(root, { type, userID, roomID }) {
            if (type == "all") {
                //removeAllMemberExceptHost
                return Room.updateMany({ "_id": roomID }, { $pull: { "member": { "member.$[].isHost": false } } }, { multi: true }, (err, raw) => {
                    console.log("raw " + raw);

                }).then(value => {

                    return { "data": value, "result": true }
                }).catch(err => {
                    return { "data": err, "result": false }
                });
            } else if (type == "once") {
                //remove specify member
                return Room.findOneAndUpdate({ _id: idRoom }, { $pull: { "member": { "_id": { $in: [userID] } } } }, { rawResult: true }).then(value => {
                    console.log(value);
                    if (value) { return { "data": value, "result": true } }
                }).catch(err => {
                    console.log("err " + err);

                    return { err, "result": false }
                });
            }

        },

        async changeHost(root, { oldHost, newHost }) {


        },
        async findRoomByName(root, { room_name }) {

            return Room.find({ "roomName": { '$regex': room_name, $options: 'i' } });
        },
        async getRoomCreateByUser(root, { idUser, name }) {
            return Room.aggregate([{ $match: { "host_name.username": name } }], (err, res) => {

            })
        },

        /* async joinRoomChat(root, { id_room, id_user }) {
             return RoomChat.findOneAndUpdate({ "id_room": id_room }, { $push: { member: v } }, { upsert: true, new: true }).then(value => {
                 console.log(value)
                     return { "data": value, "result": true };
            }).catch(err => {
                     return { "data": err, "result": false };
             })
           
         },*/
        /*async onJoinRoom(root, { id_room, id_user, pwd }) {
            return Room.findById(id_room).then(async value => {

                if (value.isPrivate == true && value.password == pwd) {
                    return User.findById(id_user).then(async res => {
                        return RoomChat.findByIdAndUpdate({ "id_room": id_room }, { $push: { "member": res } }, { upsert: true, new: true }).then(v => {
                            return Room.findByIdAndUpdate(id_room, { $push: { "member": res } }, { upsert: true, new: true }, (err, res) => {
                            }).then(val => {
                                return { "data": val, "result": true };
                            }).catch(err => {
                                return { "data": err, "result": false };
                            })
                        });
                    })
                }
                else if (value.password != pwd) {
                    return { "status": "Wrong password", "result": false };
                }
                else {
                    return User.findById(id_user).then(async res => {
                        return RoomChat.findOneAndUpdate({ "id_room": id_room }, { $push: { "member": res } }, { upsert: true, new: true }).then(v => {
                            return Room.findByIdAndUpdate(id_room, { $push: { "member": res } }, { upsert: true, new: true }, (err, res) => {
                            }).then(val => {
                                return { "data": val, "result": true };
                            }).catch(err => {
                                return { "data": err, "result": false };
                            })
                        });
                    })
                }

            })


        },*/
        async addMember(root, { roomID, userID }) {
            return Room.findByIdAndUpdate(roomID, { $push: { member: userID } }, { upsert: true, new: true }).then(result => {
                console.log(result);
                if (value) {
                    return {
                        status: 201,
                        "success": true,
                        message: "Add success!"
                    }
                }
            }).catch(err => {
                return {
                    status: 401,
                    "success": false,
                    message: "Add failded!"
                }
            })

        },
        //them tin nhan vao group chat 
        async chatGroup(root, { id_room, chat_message }) {

            return RoomChat.findOneAndUpdate({ "id_room": id_room }, { $push: { messages: chat_message } }).then(v => {
                return v;
                //console.log(v.messages[0].time);
            })
            /*return RoomChat.findByIdAndUpdate(id_room,{$push:{messages:chat_message}},{upsert:true,new:true}).then(result=>{
                console.log(result);
                return {"data":result,"result":true}
            }).catch(err=>{return {"data":err,"result":false}});*/
        },
        // lay tat ca tin nhan trog mot phong dua vao id_room
        async getAllMessage(root, { id_room, sl }) {

            return RoomChat.findOne({ "id_room": id_room }).then(result => {
                return result
            })
        },

        async getListGame(root, { limit }, { dataloaders: { listGameLoader } }) {
            //return ListGame.create(input);
            if (limit == 1) {
                return await ListGame.find({}, {}, { slice: { 'images': 1 } }).lean(true).then((f) => {
                    //var v =  listGameLoader.load(f);
                    //console.log(listGameLoader.load(f));

                    const mapped = f.map(async (e) => {
                        var url = "";
                        return RoomBackground.findOne({ "gameID": e._id }).then((val) => {
                            url = val.background.url;
                            return ({ ...e, "background": url })
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
        getRandomGame: async (root) => {
            return await ListGame.find({}, {}, { slice: { 'images': 1 } }).then((f) => {
                var listImage = [];
                //console.log(f)
                return f;
            });
        },
        getGameByGenre: async (root, { type }, context) => {
            console.log("Token here", context.token);
            return ListGame.find({ "genres": { $regex: type, $options: 'i' } }).then((v) => {
                //console.log(v);
                return v;
            })
        },
        // show ra nhung phong host ma co thanh vien cho 
        approveList_Host: async (root, { hostID }, context) => {
            return ApporoveList.aggregate([{ $match: { "hostID": hostID } }]).then((v) => {
                return v;
            });

        },
        // show ra nhung phong user dang cho duoc duyet 
        approveList_User: async (root, { userID }, context) => {
            return ApporoveList.aggregate([{ $match: { "userID": userID } }]).then((v) => {
                return v;
            })
        },
        getRoomByGame: async (root, { gameID }) => {
            return Room.aggregate([{ $match: { "game.gameID": gameID } }]);
        },
        roomManage: async (_, { hostID }) => {
            return Room.aggregate([{ $match: { "hostID": hostID } }]);
        },
        getSummaryByGameID: async (_, { gameID }) => {
            return ListGame.find({ "_id": gameID }).lean();
        },
        countRoomOnEachGame: async (_,{sort}) => {
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
                
                if(sort=='ASC'){
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
        fetchNews :async()=>{
            return News.find();
        }

    },
    Mutation: {

        async createGame(root, { input }) {
            return ListGame.create(input).then((value) => {
                return {
                    status: 201,
                    "success": true,
                    message: "Create game success!"
                };
            }).catch((err) => {
                console.log(err);

                return {
                    status: 201,
                    "success": true,
                    message: "Create game failed!"
                }
            });
        }
        ,
        async removeRoom(root, { roomID, userID }, context) {
            try {
                let result = verify(context.token, process.env.SECRET_KEY, { algorithms: "HS512" });
                if (result.id == userID) {
                    return Room.deleteOne({ "_id": roomID }).then((v) => {
                        return {
                            status: 201,
                            "success": true,
                            message: "Remove success!"
                        }
                    }).catch((e) => {
                        return {
                            status: 201,
                            "success": true,
                            message: "Remove failed!"
                        }
                    });
                }
            }
            catch (e) {
                return {
                    status: 201,
                    "success": true,
                    message: new AuthenticationError("Wrong token")
                }
            }
        },
        createRoom: async (_, { roomInput, roomChatInput, userID }, context) => {

            try {
                /*let result = verify(context.token,process.env.SECRET_KEY, { algorithms: "HS512" });
                console.log("asdasd",context);*/

                if (userID == userID) {
                    return Room.aggregate([{ $match: { "roomName": roomInput.roomName } }]).then((v) => {
                        if (v.length > 0) {
                            return {
                                status: 400,
                                "success": false,
                                message: "This name already taken"
                            }
                        }
                        else return Room.create(roomInput).then(async (value) => {
                            return RoomChat.create(roomChatInput).then(async (v) => {
                                return RoomChat.findByIdAndUpdate(v._id, { "roomID": value._id }).then((v) => {
                                    return {
                                        status: 201,
                                        "success": true,
                                        message: "Create success!"
                                    }
                                })

                            })
                        }).catch(err => {
                            return { status: 400, "success": false, "message": "Create failed!" }
                        })
                    })

                }
                else return { status: 400, "success": false, "message": "You have wrong certificate!" }
            } catch (error) {
                console.log(error);

                return new AuthenticationError("Wrong token");
            }
        },


        /**
         * 
         * @param {userID} "user join room" 
         * @param {roomID} "room user join" 
         * @param {Info} "info need for approve list"
         */
        async joinRoom(root, { roomID, currentUserID, info }) {
            //check userID is not host

            return Room.aggregate([{ $match: { "roomID": roomID, "hostID": currentUserID }, }]).then((v) => {
                console.log(v.length);

                if (v.length < 1) {
                    return ApporoveList.find({ "roomID": roomID }).then((v) => {
                        console.log(v.length);

                        if (v.length > 0) {
                            return {
                                "message": "You has been joined room, choose another room",
                                "status": 401,
                                "result": false
                            }
                        }
                        else return ApporoveList.create(info).then((v) => {
                            return { "message": "Waiting for apporove", "status": 200, "result": true };;

                        })
                    })
                }
                else {
                    return { "message": "You are host", "status": 401, "result": false };
                }

            })
        },
        editRoom: async (_, { hostID, roomID, newData }, context) => {


            try {
                let result = verify(context.token, process.env.SECRET_KEY, { algorithms: "HS512" });


                if (result.id == hostID) {
                    return Room.findOneAndUpdate(
                        { "_id": roomID },
                        {
                            $set: {
                                "roomName": newData.roomName,
                                "isPrivate": newData.isPrivate,
                                "description": newData.description,
                                "member": newData.member,
                                "maxOfMember": newData.maxOfMember,
                            }
                        },
                        { upsert: true, 'new': true }).then(res => {
                            return { status: 200, "success": true, "message": "Update success!" }
                        }).catch(err => {

                            return { status: 401, "success": false, "message": "Somethings wrong during update..." }
                        })
                }
            } catch (error) {
                return {
                    status: 401, "success": false, "message": "You have wrong certificate!"
                }
            }

        },
        /*async chatGlobal({ name, input }) {
            GlobalRoom.findOneAndUpdate({ room_name: name }, { $push: { message: input } }, { upsert: true, rawResult: true }, (err, doc) => {
                console.log(doc.ok);
            })
        },*/
        // id_user: id from host message, id_friends

        async chatPrivate(root, { currentUserID, friendID, input }) {
            //condition 1: currentID is the host.
            return ChatPrivate.findOneAndUpdate(
                { $and: [{ "currentUser.id": currentUserID }, { $and: [{ "friend.id": friendID }] }] }, { $push: { messages: input } }
            ).then(async (v) => {

                console.log("Here" + v);
                // condition 2: currentID is the guest.
                if (v == null) {
                    return ChatPrivate.findOneAndUpdate(
                        { $and: [{ "friend.id": currentUserID }, { $and: [{ "currentUser.id": friendID }] }] }, { $push: { messages: input } }
                    )
                        .then(async (value) => {
                            // mean conversation is not avaiable... notify user to craete new 
                            if (value == null) {
                                return { status: 401, "success": false, "message": "Conversation is not avaialbe !" }
                            }
                            // console.log(value);

                            else return { status: 200, "success": true, "message": "Add messages success!" }

                        }).catch((err) => {
                            console.log("err");
                        })
                }
                else return { status: 200, "success": true, "message": "Add messages success!" }

            }).catch(async (err) => {

                return { status: 401, "success": false, "message": "Add messages failed!" }

            });
        },

        async createPrivateChat(root, { input }) {
            return ChatPrivate.create(input).then((v) => {
                return { status: 200, "success": true, "message": "Create success!" }
            }).catch((v) => {
                return { status: 401, "success": false, "message": "Create fail..." }
            });
        },
        /*async createChatGlobal(root, { input }) {
            return await GlobalRoom.create(input);
        },*/
        deleteMessage: async (root, { currentUserID, friendID, messageID }) => {
            return ChatPrivate.findOneAndUpdate(
                {
                    $and: [{ "currentUser.id": currentUserID },
                    { $and: [{ "friend.id": friendID }] }]
                },
                { $pull: { "messages": { _id: messageID } } },
                { rawResult: true, new: true }
            ).then((v) => {
                // error
                if (v.value == null) {
                    return { status: 401, "success": false, "message": "Delete fail..." }
                }
                else return { status: 200, "success": true, "message": "Delete success!" }
            }).catch((err) => {
                console.log(err);

                return { status: 401, "success": false, "message": "Delete fail..." }
            });
        },
        createRoomBackground: async (_, { input }) => {

            return RoomBackground.create(input).then((v) => {
                return { status: 200, "success": true, "message": "Create success!" }
            }).catch((err) => {
                return { status: 200, "success": false, "message": "Create fail!" }
            });
        },
        async upload(root, { file, userID, type }) {
            return (processUpload(file, userID));
        },
    },

}
const processUpload = async (file, userID) => {
    const { filename, mimetype, createReadStream } = await file;
    var stream = createReadStream();
    let resultUrl = '';
    const cloudinaryUpload = async ({ stream }) => {
        try {
            await new Promise((resolve, reject) => {
                const streamUpload = cloudinary.uploader.upload_stream(
                    {
                        tags: "avatar",
                        folder: "avatar/" + userID,
                    },
                    (err, result) => {
                        if (result) {
                            resultUrl = result.url;
                            resolve(resultUrl);
                        }
                        else {
                            reject(error);
                        }
                    });
                stream.pipe(streamUpload);
            })
        } catch (error) {
            return { "code": "400", "fail": true, message: "Upload fail", "image_url": "null" };

        }
    }
    await cloudinaryUpload({ stream });
    return { "code": "200", "success": true, message: "Upload success", "image_url": resultUrl };
}

