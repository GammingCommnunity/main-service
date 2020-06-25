const { getRoomInfo, getHostID, editRoom, checkHost, deleteRoom, updateRoom, deleteJoinRequest, confirmJoinRequest
    , inPendingList, isJoinRoom, initGroupPost, generateInviteCode, searchByRoomName, searchByCode } = require('../../service/roomService');
const { getUserID } = require('../../src/util');
const { onError, onSuccess } = require('../../src/error_handle');
const { checkRequestExist, addApprove } = require('../../service/requestService');
const { Room } = require('../../models/room');
const RoomChats = require('../../models/chat_room');
const gameService = require('../../service/gameService');
const { PubSub, PubSubEngine, withFilter } = require('apollo-server');
const pubsub = new PubSub();
const JOIN_ROOM = 'JOIN_ROOM';
var _ = require('lodash');

module.exports = resolvers = {
    Query: {
        searchRoom: async (root, { query, gameID,hideJoined }, ctx) => {
            var accountID = getUserID(ctx);
            //Room.where('roomName').regex(new RegExp(`${query}`, 'i'))
            if (gameID == (null || undefined)) {
                var result = await searchByCode(query, hideJoined);
                return result.length > 0 ? result : await searchByRoomName(query, "","",hideJoined);
            }
            else {
                var result = await searchByCode(query, gameID, accountID, hideJoined);
                return result.length > 0 ? result : await searchByRoomName(query, gameID, accountID, hideJoined);
            }


        },
        getRoomInfo: async (_, { roomID }) => {
            return await getRoomInfo(roomID);
        },
        getRoomJoin: async (_, { userID }, context) => {
            var accountID = getUserID(context);
            return Room.find({ "member": { "$in": [accountID] } });
        },
        inviteToRoom: async (_, { roomID }, context) => {
            // double of randombytes
            var code = generateInviteCode();
            var accountID = getUserID(context);

            if (checkHost(roomID, accountID)) {
                // true, add code to that room
                return Room.updateOne({ "_id": roomID }, { "code": code }).then((v) => {
                    return onSuccess("Successful generate code !", code)
                }).catch((err) => {
                    return onError('fail', "Generate fail. Try again")
                })
            }
            else {
                return onError('fail', "You don't have permission!")
            }

        },
        async getRoomCreateByUser(_, { }, context) {
            var accountID = getUserID(context);

            return Room.aggregate([{ $match: { "hostID": accountID } }]);
        },
        getRoomByGame: async (root, { limit, page, gameID, groupSize, hideJoined }, context) => {
            
            var accountID = getUserID(context);
            // const result = (await Room.paginate({ "game.gameID": gameID }, { limit: limit, page: page })).docs;
            const smallGroup = [];
            const largeGroup = [];

            const exp = {

                "isJoin": {
                    $in: [accountID, "$member"]
                },
                "isRequest": {
                    $in: [accountID, "$pendingRequest"]
                },
                "countMember": { $size: "$member" }
            }


            const gg = groupSize == "small" ? 4 : groupSize == "large" ? 8 : 0;
            //const cond = hideJoined == true ? { $eq: [{ $in: [accountID, "$member"] }, false] } : { $eq: [{ $in: [accountID, "$member"] }, false] }
            const myAggregate = Room.aggregate([
                { $match: { "game.gameID": gameID }, },
                { $skip: page <= 1 ? 0 : (page * 10 - 10) },
                { $limit: limit },
                

                /*{
                    $addFields: {
                        "isJoin": {
                            $cond: {
                                if: {
                                    "hostID": { $eq: [accountID, null] }
                                },
                                then: true,
                                else: false
                            }
                        },
                        "isRequest": {
                            $in: [accountID, "$pendingRequest"]
                        },
                        "countMember": { $size: "$member" }
                    }
                },*/
              
                {
                    "$project": {
                        "data": "$$ROOT",
                        "additionData": {
                            "$cond": [
                                {
                                    $and: [
                                        { $eq: [gg, 0] },
                                        { $ne: ["$roomType", "hidden"] },
                                        hideJoined ? { $eq: [{ $in: [accountID, "$member"] }, false] } : {}

                                    ]

                                },
                                //normal
                                exp,
                                {
                                    "$cond": [
                                        { $lte: [gg, 4] },
                                        //small
                                        {
                                            $cond: [
                                                {
                                                    $and: [
                                                        { $lte: ["$maxOfMember", 8] },
                                                        {
                                                            $gte: ["$maxOfMember", 4]
                                                        },
                                                        { $ne: ["$roomType", "hidden"] },
                                                        hideJoined ? { $eq: [{ $in: [accountID, "$member"] }, false] } : {}
                                                    
                                                    ]
                                                },
                                                exp, null
                                            ]
                                        },
                                        //large
                                        {
                                            $cond: [

                                                {
                                                    $and: [
                                                        { $gte: ["$maxOfMember", 8] },
                                                        { $ne: ["$roomType", "hidden"] },
                                                        hideJoined ? { $eq: [{ $in: [accountID, "$member"] }, false] } : {}
                                                    ]

                                                },
                                                exp, null
                                            ]
                                        },
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    $match: {
                       
                        "additionData": {
                            "$exists": true,
                            "$ne": null,
                        }
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                "$data",
                                "$additionData"]
                        }
                    }

                },


            ])
            var res = await Room.aggregatePaginate(myAggregate);

            return res.docs

        },
        roomManager: async (_, { }, context) => {
            var accountID = getUserID(context);

            return Room.aggregate([

                { $match: { "member": accountID } }
            ]);

        },

    },
    Mutation: {
        createRoom: async (root, { roomInput, needApproved }, context) => {
            var accountID = getUserID(context);
            var code = generateInviteCode();
            var member = roomInput.member;
            var gameName = await gameService.getGameNameById(roomInput.game.gameID);

            var roomChatInput = {
                roomID: "",
                member: member.push(accountID),
                messages: []
            }

            if (!gameName) {
                return onError('fail', "Game ID not exist! ")
            }

            var gameInfo = _.assign(roomInput.game, { gameName: gameName })
            var roomInfo = _.assign({}, roomInput, { hostID: accountID, member: member });

            return Room.aggregate([{ $match: { "roomName": roomInput.roomName } }]).then((v) => {
                if (v.length > 0) {
                    return onError('fail', "This name already taken")
                }
                else
                    if (roomInput.roomName == "") {
                        return onError('fail', "Room name can't null.")
                    }
                return Room.create(roomInfo).then(async (value) => {
                    return RoomChats.create(roomChatInput).then(async (v) => {
                        return RoomChats.findByIdAndUpdate(v._id, { "roomID": value._id }).then(async (v) => {
                            // init post model
                            await initGroupPost(value._id, needApproved, context.token);
                            return onSuccess("Create room success!");

                        })

                    })
                }).catch(err => {
                    console.log(err);

                    return onError("Create room failed!")
                })
            })
        },
        removeRoom: async (root, { roomID }, context) => {
            var accountID = getUserID(context);

            try {
                /*let result = verify(context.token, process.env.secret_key_jwt, { algorithms: "HS512" });
                console.log(result);*/
                var result = await deleteRoom(roomID, accountID)
                return result ? onSuccess("Remove success!") : onError('fail', "Remove failed!")

            }
            catch (e) {
                console.log(e);

                return onError('unAuth', new AuthenticationError("Wrong token"))
            }
        },
        editRoom: async (_, { roomID, newData }, context) => {
            try {
                var accountID = getUserID(context);

                var data = {
                    "roomName": newData.roomName,
                    "description": newData.description,
                    "member": newData.member,
                    "maxOfMember": newData.maxOfMember,
                }
                var result = await editRoom(accountID, roomID, data);
                return result ? onSuccess("Update success!") : onError('fail', "Somethings wrong during update...");
            } catch (err) {
                return onError('fail', "Somethings wrong during update...")
            }
        },
        /**
        * 
        * @userID  "user join room"
        * @roomID  "room user join"
        * @Info "info need for approve list"
        */
        async joinRoom(root, { roomID, roomType, code }, context) {
            //check userID is not host
            var accountID = getUserID(context);

            if (await checkHost(roomID, accountID)) {
                return onError('fail', "You are host");
            }
            else {

                var roomInfo = await getRoomInfo(roomID);
                const isRequest = await checkRequestExist(roomID, accountID);
                const inPending = await inPendingList(roomID, accountID); // has value in pendingRequest

                // check already a member

                if (await isJoinRoom(roomID, accountID)) {
                    return onError('fail', "You are member!")
                }
                else if (roomType == "public") {
                    // join direct
                    return Room.findOneAndUpdate({ "_id": roomID }, { "member": { $push: accountID } }).then((_) => {
                        const newComer = {
                            "type": 1,
                            "roomName": roomInfo.roomName,
                            "hostID": info.hostID,
                            "userID": apporoveResult.userID,
                            "joinTime": apporoveResult.joinTime,
                            "message": `Welcome to ${roomInfo.roomName}`,
                            "isApprove": true
                        }
                        pubsub.publish([JOIN_ROOM], { onJoinRoom: newComer })
                    });

                }
                else if ("roomType" == "hidden") {
                    // hidden room
                    if (code == (null || undefined)) {
                        return onError('fail', "You can't join this room");
                    }
                    else {
                        
                    }
                }
                // check if in pending or has request
                else if (isRequest || inPending) {
                    return onError('fail', "You has been requested to join room, choose another room")
                }
                // add to approve
                else {
                    const info = {
                        hostID: await getHostID(roomID),
                        userID: accountID,
                        roomID: roomID
                    }
                    // add user request to approveList
                    const apporoveResult = await addApprove(info);
                    if (_ != null) {
                        const addToPending = await updateRoom("", roomID, { $push: { "pendingRequest": accountID } });
                        const newComer = {
                            "type": 2,
                            "roomName": roomInfo.roomName,
                            "hostID": roomInfo.hostID,
                            "userID": apporoveResult.userID,
                            "message": "Your request has been recorded. Wait for accept.",
                            "joinTime": apporoveResult.joinTime,
                            "isApprove": false
                        }
                        pubsub.publish([JOIN_ROOM], { onJoinRoom: newComer })

                        return onSuccess("Waiting for apporove", apporoveResult._id);
                    }
                    return onSuccess("fail", "Has error")
                }

            }

        },

        changeGroupPhoto: async (root, { groupID, type, url }) => {
            return Room.findByIdAndUpdate(groupID,
                type == "profile" ? { $set: { roomLogo: url } } : { $set: { roomBackground: url } }
            ).then((v) => {
                return onSuccess("Change success!")
            }).catch((err) => onError("fail", "Change failded!"))

        },

        // id_user: id from host message, id_friends
        async addMember(root, { roomID, memberID }) {

            return Room.findByIdAndUpdate(roomID, { $push: { member: memberID } }, { upsert: true, new: true }).then(result => {
                console.log(result);
                if (value) {
                    return onSuccess("Add success!")

                }
            }).catch(err => {
                return onError("fail", "Add failded!")
            })

        },
        leaveRoom: async (root, { roomID }, context) => {
            var accountID = getUserID(context);
            console.log(accountID);

            return Room.findOneAndUpdate({ _id: roomID }, { $pull: { "member": accountID } }).then((_) => {
                return RoomChats.findOneAndUpdate({ roomID: roomID }, { $pull: { "member": accountID } }).then((_) => {
                    return onSuccess("Leave success");
                })
            }).catch((err) => {
                return onError('fail', "Leave fail")
            })
        }
    }
}