require('dotenv').config();
var cloudinary = require('cloudinary').v2;
const { Room } = require('./models/room')
const RoomChats = require('./models/chat_room');
const { ListGame } = require('./models/list_game');
const ChatPrivate = require('./models/chat_private/chat_private');
const ApproveList = require('./models/approve_list');
const RoomBackground = require('./models/room_background');
const { GraphQLUpload } = require('graphql-upload');
const { AuthenticationError } = require('apollo-server')
const { sign, verify } = require('jsonwebtoken');
const { Genres, Platforms, MessageType } = require('./src/enum');
const { GamesRadars, PCGamer } = require('./models/News/News');
const { onError, onSuccess } = require('./src/error_handle');
const { PubSub, PubSubEngine, withFilter } = require('apollo-server');
const { checkHost, getRoomInfo, confirmJoinRequest, deleteJoinRequest, deleteRoom, editRoom } = require('./service/roomService');
const { getGameInfo } = require('./service/gameService');
var crypto = require("crypto");
const pubsub = new PubSub();

const JOIN_ROOM = 'JOIN_ROOM';
const RECIEVE_MESSAGE = 'RECIEVE_MESSAGE';
const GROUP_MESSAGE = 'GROUP_MESSAGE';


module.exports = resolvers = {
    Upload: GraphQLUpload,
    Date: Date,
    //import enum type here
    Genres, Platforms, MessageType,

    Subscription: {

        onJoinRoom: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([JOIN_ROOM]),
                (payload, variable) => {
                    if (variable.onJoinRoom.type == 1) {
                        // user notfication

                    }
                    else return payload.onJoinRoom.hostID === variable.hostID
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
    Query: {

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

        async changeHost(root, { oldHost, newHost }) {


        },
        async findRoomByName(root, { room_name }) {

            return Room.find({ "roomName": { '$regex': room_name, $options: 'i' } });
        },
        async getRoomCreateByUser(root, { userID }) {
            return Room.aggregate([{ $match: { "hostID": userID } }]);
        },
        async getRoomJoin(_, { userID }) {
            return Room.find({ "member": { "$in": [userID] } });
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


        // lay tat ca tin nhan trog mot phong dua vao id_room
        async getRoomMessage(root, { roomID }) {

            return RoomChats.findOne({ "roomID": roomID }).then(result => {
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
        // show ra nhung phong host ma co thanh vien cho 
        manageRequestJoin_Host: async (root, { hostID }, context) => {
            return ApproveList.aggregate([{ $match: { "hostID": hostID } }]).then((v) => {
                return v;
            });

        },
        // show ra nhung phong user dang cho duoc duyet 
        getPendingJoinRoom_User: async (root, { userID }, context) => {
            return ApproveList.aggregate([{ $match: { "userID": userID } }]).then((v) => {
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
        countRoomOnEachGame: async (_, { sort }) => {
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
        fetchNews: async (_, { name, page, limit }) => {

            switch (name) {
                case 'pcgamer':
                    return PCGamer.paginate({}, { page: page, limit: limit, lean: true, leanWithId: true, sort: { _id: -1 } }).then((v) => {
                        return v.docs
                    })
                    break;
                case 'gameradar':
                    return GamesRadars.paginate({}, { page: page, limit: limit, lean: true, leanWithId: true, sort: { _id: -1 } }).then((v) => v.docs)
                    break;
                default:
                    break;
            }
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
        getPrivateChatInfo: async (_, { roomID }) => {
            var member = [];
            return ChatPrivate.findOne({ _id: roomID }).select(["friend", "currentUser"]).lean(true).then((v) => {
                //console.log(v.friend);,
                // spread operator
                member.push(...[v.friend], ...[v.currentUser]);
                //console.log(member);

                return { member: member };
            }).catch((err) => {

            })

        },
        getRoomChatInfo: async (_, { groupID }) => {
            return RoomChats.findOne({ "roomID": groupID }).select(["member", "roomID"]).then((v) => {
                return v
            }).catch((err) => {

            });
        },
        inviteToRoom: async (_, { hostID, roomID }) => {
            // double of randombytes
            let r = crypto.randomBytes(3).toString('hex');
            if (checkHost(roomID, hostID)) {
                // true, add code to that room
                return Room.updateOne({ "_id": roomID }, { "code": r }).then((v) => {
                    return onSuccess("Successful generate code !", r)
                }).catch((err) => {
                    return onError('fail', "Generate fail. Try again")
                })
            }
            else {
                return onError('fail', "You don't have permission!")
            }

        },
        getRoomInfo: async (_, { roomID }) => {
            return await getRoomInfo(roomID);
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
        removeRoom: async (root, { roomID, userID }, context) => {

            try {
                /*let result = verify(context.token, process.env.secret_key_jwt, { algorithms: "HS512" });
                console.log(result);*/
                var result = await deleteRoom(roomID, userID)
                return result ? onSuccess("Remove success!") : onError('fail', "Remove failed!")

            }
            catch (e) {
                console.log(e);

                return onError('unAuth', new AuthenticationError("Wrong token"))
            }
        },
        createRoom: async (_, { roomInput, roomChatInput, userID }, context) => {

            try {
                /*let result = verify(context.token,process.env.SECRET_KEY, { algorithms: "HS512" });
                console.log("asdasd",context);*/

                if (userID == userID) {
                    return Room.aggregate([{ $match: { "roomName": roomInput.roomName } }]).then((v) => {
                        if (v.length > 0) {
                            return onError('fail', "This name already taken")
                        }
                        else return Room.create(roomInput).then(async (value) => {
                            return RoomChats.create(roomChatInput).then(async (v) => {
                                return RoomChats.findByIdAndUpdate(v._id, { "roomID": value._id }).then((v) => {
                                    return onSuccess("Create success!", value._id)
                                })

                            })
                        }).catch(err => {
                            console.log(err);

                            return onError("Create failed!")
                        })
                    })

                }
                else return onError('unAuth', "You have wrong certificate!")
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
        async joinRoom(root, { roomID, currentID, info }) {
            //check userID is not host
            if (await checkHost(roomID, currentID)) {
                return onError('fail', "You are host");
            }
            else {

                var roomInfo = await getRoomInfo(roomID);
                return ApproveList.find({ "roomID": roomID, "userID": currentID }).then((v) => {

                    if (v.length > 0) {
                        return onError('fail', "You has been joined room, choose another room")
                    }
                    else return ApproveList.create(info).then((apporoveResult) => {

                        const newComer = {
                            "type": 2,
                            "roomName": roomInfo.roomName,
                            "hostID": info.hostID,
                            "userID": apporoveResult.userID,
                            "joinTime": apporoveResult.joinTime,
                            "isApprove": false
                        }
                        pubsub.publish([JOIN_ROOM], { onJoinRoom: newComer })

                        return onSuccess("Waiting for apporove");;
                    })
                })
            }

        },
        editRoom: async (_, { hostID, roomID, newData }, context) => {
            try {
                //let result = verify(context.token, process.env.secret_key_jwt, { algorithms: "HS512" });
                var data = {
                    "roomName": newData.roomName,
                    "isPrivate": newData.isPrivate,
                    "description": newData.description,
                    "member": newData.member,
                    "maxOfMember": newData.maxOfMember,
                    "roomBackground": newData.roomBackground,
                    "roomLogo": newData.roomLogo
                }
                var result = await editRoom(hostID, roomID, data);
                return result ? onSuccess("Update success!") : onError('fail', "Somethings wrong during update...");
            } catch (err) {
                return onError('fail', "Somethings wrong during update...")
            }
        },

        // id_user: id from host message, id_friends
        async addMember(root, { roomID, userID }) {
            return Room.findByIdAndUpdate(roomID, { $push: { member: userID } }, { upsert: true, new: true }).then(result => {
                console.log(result);
                if (value) {
                    return onSuccess("Add success!")

                }
            }).catch(err => {
                return onError("fail", "Add failded!")
            })

        },
        //them tin nhan vao group chat 
        async chatRoom(root, { roomID, messages }) {
            console.log(messages);

            return RoomChats.findOneAndUpdate({ "roomID": roomID }, { $push: { messages: messages } }).then(v => {
                const now = new Date().toISOString();
                const messges = {
                    "groupID": roomID,
                    "type": messages.type,
                    "senderID": messages.userID,
                    "message": messages.text,
                    "sendDate": now
                }
                pubsub.publish(GROUP_MESSAGE, {
                    groupNewMessage: messges
                });
                return onSuccess("Chat OK");
                //console.log(v.messages[0].time);
            }).catch((err) => {
                console.log(err);

                return onError('fail', "Chat failed!")
            })
            /*return RoomChat.findByIdAndUpdate(id_room,{$push:{messages:chat_message}},{upsert:true,new:true}).then(result=>{
                console.log(result);
                return {"data":result,"result":true}
            }).catch(err=>{return {"data":err,"result":false}});*/
        },
        async chatPrivate(root, { currentUserID, friendID, input }) {
            //condition 1: sender is current User
            return ChatPrivate.findOneAndUpdate(
                { $and: [{ "currentUser.id": currentUserID }, { $and: [{ "friend.id": friendID }] }] }, { $push: { messages: input } }
            ).then(async (v) => {

                console.log("Here" + v);
                // condition 2: sender is guest.
                if (v == null) {
                    return ChatPrivate.findOneAndUpdate(
                        { $and: [{ "friend.id": currentUserID }, { $and: [{ "currentUser.id": friendID }] }] }, { $push: { messages: input } }
                    )
                        .then(async (value) => {
                            // mean conversation is not avaiable... notify user to craete new 
                            if (value == null) {
                                return onError('fail', "Conversation is not avaialbe !")
                            }
                            // console.log(value);

                            else {
                                const now = new Date().toISOString();
                                const newMessage = {
                                    message: input.text,
                                    senderID: friendID,
                                    sendDate: now,
                                }
                                pubsub.publish(RECIEVE_MESSAGE, {
                                    recieveNewMessage: newMessage
                                })
                                return onSuccess("Add messages success!")
                            }

                        }).catch((err) => {
                            console.log(err);
                        })
                }
                else return onSuccess("Add messages success!")

            }).catch(async (err) => {

                return onError('fail', "Add messages failed!")

            });
        },

        async createPrivateChat(root, { input }) {
            return ChatPrivate.create(input).then((v) => {
                return onSuccess("Create success!")
            }).catch((v) => {
                return onError('fail', "Create fail...")
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
        confirmUserRequest: async (_, { hostID, userID, roomID }) => {

            var result = await confirmJoinRequest(hostID, userID, roomID);
            if (result) {
                return onSuccess("OK")
            }
            else return onError("fail","Has error, try again")


        },

        cancelRequest: async (_, {hostID,roomID, userID }) => {
            var result = await deleteJoinRequest(hostID, userID, roomID);
            return result ? onSuccess("Cancel success") : onError("fail","Has error");
        },

        RmvMbFrRoom: async (root, { type, userID, roomID }) => {
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

        async upload(root, { file, userID, type }) {
            return (processUpload(file, userID));
        },
    },

}
/*const processUpload = async (file, userID) => {
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
}*/

