var crypto = require("crypto");
const { getRoomInfo, getHostID, editRoom, checkHost, deleteRoom, updateRoom, deleteJoinRequest, confirmJoinRequest
    , inPendingList, isJoinRoom,initGroupPost } = require('../../service/roomService');
const { getUserID } = require('../../src/util');
const { onError, onSuccess } = require('../../src/error_handle');
const { checkRequestExist, addApprove } = require('../../service/requestService');
const { Room } = require('../../models/room');
const RoomChats = require('../../models/chat_room');

const { PubSub, PubSubEngine, withFilter } = require('apollo-server');
const pubsub = new PubSub();
const JOIN_ROOM = 'JOIN_ROOM';
var _ = require('lodash');

module.exports = resolvers = {
    Query: {
        searchRoom: async (root, { query, option }, ctx) => {
            return option == "byID" ? Room.find({ _id: query }) : Room.where('roomName').regex(new RegExp(`${query}`, 'i'))
        },
        getRoomInfo: async (_, { roomID }) => {
            return await getRoomInfo(roomID);
        },
        getRoomJoin: async (_, { userID }, context) => {
            var accountID = getUserID(context);
            return Room.find({ "member": { "$in": [accountID] } });
        },
        inviteToRoom: async (_, {roomID }, context) => {
            // double of randombytes
            let r = crypto.randomBytes(3).toString('hex');
            var accountID = getUserID(context);

            if (checkHost(roomID, accountID)) {
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
        async getRoomCreateByUser(_, { }, context) {
            var accountID = getUserID(context);

            return Room.aggregate([{ $match: { "hostID": accountID } }]);
        },
        getRoomByGame: async (root, { limit, page, gameID, groupSize }, context) => {
            var accountID = getUserID(context);
            const result = (await Room.paginate({ "game.gameID": gameID }, { limit: limit, page: page })).docs;
            const smallGroup = [];
            const largeGroup = [];

            var mapped = _.forEach(result, async (value) => {
                // get member
                var member = _.get(value, "member");
                var pending = _.get(value, "pendingRequest");
                var maxOfMember = _.get(value, "maxOfMember");
                // check if user is member

                if (_.includes(member, accountID) && _.get(value, "hostID") != accountID) {
                    _.assign(value, { "isJoin": true, "isRequest": false })
                }
                if (_.includes(pending, accountID)) {
                    _.assign(value, { "isJoin": false, "isRequest": true })
                }
                else {
                    _.assign(value, { "isJoin": false, "isRequest": false })
                }

                return maxOfMember > 4 ? largeGroup.push(value) : smallGroup.push(value)
            })
            if (groupSize == "none") {
                return mapped;
            }
            else return groupSize == "large" ? largeGroup : smallGroup;
            //return Room.aggregate([{ $match: { "game.gameID": gameID } }]);
        },
        roomManager: async (_, { }, context) => {
            var accountID = getUserID(context);

            return Room.aggregate([

                { $match: { "member": accountID } }
            ]);


        },
    },
    Mutation: {
        createRoom: async (_, { roomInput, roomChatInput }, context) => {
            var accountID = getUserID(context);
            console.log(context);
            
           /* return Room.aggregate([{ $match: { "roomName": roomInput.roomName } }]).then((v) => {
                if (v.length > 0) {
                    return onError('fail', "This name already taken")
                }
                else return Room.create(roomInput).then(async (value) => {
                    return RoomChats.create(roomChatInput).then(async (v) => {
                        return RoomChats.findByIdAndUpdate(v._id, { "roomID": value._id }).then((v) => {
                            // init post model
                            initGroupPost(value._id,context)
                            return onSuccess("Create success!", value._id)
                        })

                    })
                }).catch(err => {
                    console.log(err);

                    return onError("Create failed!")
                })
            })*/
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
                    "isPrivate": newData.isPrivate,
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
        * @param {userID} "user join room" 
        * @param {roomID} "room user join" 
        * @param {Info} "info need for approve list"
        */
        async joinRoom(root, { roomID }, context) {
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
                    const apporoveResult = await addApprove(info);
                    if (_ != null) {
                        const _ = await updateRoom("", roomID, { $push: { "pendingRequest": accountID } });
                        const newComer = {
                            "type": 2,
                            "roomName": roomInfo.roomName,
                            "hostID": info.hostID,
                            "userID": apporoveResult.userID,
                            "joinTime": apporoveResult.joinTime,
                            "isApprove": false
                        }
                        pubsub.publish([JOIN_ROOM], { onJoinRoom: newComer })

                        return onSuccess("Waiting for apporove");
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