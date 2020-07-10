const { fetch } = require('cross-fetch');
const { Room } = require('../models/room');
const RoomChats = require('../models/chat_room');
const ApproveList = require('../models/approve_list');
const { onError, onSuccess } = require('../src/error_handle');
const env = require('../env');
const _ = require('lodash');
var crypto = require("crypto");
const mongoose = require('mongoose');
module.exports = {
    generateInviteCode: () => crypto.randomBytes(3).toString('hex'),
    searchByCode: async (query, gameID, accountID, hideJoined = true) => {
        if (gameID != (null || undefined)) {
            return await Room.aggregate([
                {
                    $match: {
                        $and: [
                            { "code": query },
                            { "game.gameID": gameID },
                            { roomType: { $ne: "hidden" } },

                            hideJoined ? { "member": { $nin: [accountID] } } : {}
                        ]
                    }
                },

                //{$unwind:"$member"},
                {
                    $addFields: {
                        countMember: { $size: "$member" },
                        isJoin: {
                            $in: [accountID, "$member"]
                        },
                        isRequest: {
                            $in: [accountID, "$pendingRequest"]
                        },
                    }
                },

            ])
        }
        return await Room.aggregate([
            {
                $match: {
                    $and: [
                        { "code": query },
                        { roomType: { $ne: "hidden" } },
                        hideJoined ? { "member": { $nin: [accountID] } } : {}
                    ]
                }
            },

            //{$unwind:"$member"},
            {
                $addFields: {
                    countMember: { $size: "$member" },
                    isJoin: {
                        $in: [accountID, "$member"]
                    },
                    isRequest: {
                        $in: [accountID, "$pendingRequest"]
                    },
                }
            },

        ])
    },
    searchByRoomName: async (query, gameID, accountID, hideJoined = true) => {
        if (gameID != (null || undefined)) {
            return await Room.aggregate([

                {
                    $match: {
                        $and: [
                            { "roomName": new RegExp(`${query}`, 'i') },
                            { "game.gameID": gameID },
                            { roomType: { $ne: "hidden" } },
                            hideJoined ? { "member": { $nin: [accountID] } } : {}
                        ],

                    }
                },

                //{$unwind:"$member"},

                {
                    $addFields: {
                        countMember: { $size: "$member" },
                        isJoin: {
                            $in: [accountID, "$member"]
                        },
                        isRequest: {
                            $in: [accountID, "$pendingRequest"]
                        },
                    }
                }
            ])
        }
        return await Room.aggregate([

            {
                $match:
                {
                    $and: [
                        { "roomName": new RegExp(`${query}`, 'i') },
                        { roomType: { $ne: "hidden" } },
                        hideJoined ? { "member": { $nin: [accountID] } } : {}
                    ]
                }

            },

            {
                $addFields: {
                    countMember: { $size: "$member" },
                    isJoin: {
                        $in: [accountID, "$member"]
                    },
                    isRequest: {
                        $in: [accountID, "$pendingRequest"]
                    },
                }
            }
        ])
    },
    checkHost: async (roomID, userID) => {
        const result = await Room.find({ "_id": roomID, "hostID": userID }).countDocuments();

        if (result > 0) {
            return true;
        }
        else {
            return false;
        }
    },
    initGroupPost: async (groupID, needApproved, token) => {
        var query = `
            mutation{
                initGroupPost(groupID:"${groupID}",approveFirst:${needApproved}){
                    status
                    payload
                }
            }
        `;
        return fetch(env.postService, {
            method: "POST",
            headers: { "Content-Type": "application/json", token: token },
            body: JSON.stringify({ query: query }),
        }).then((v) => v.json()).then((v) => {
            console.log(v);

            if (v.data.status == 200) return true;
            return false;
        });
    },
    countRoomByGameID: async (gameID) => {
        return await Room.find({ "game.gameID": gameID }).countDocuments();
    },
    getHostID: async (roomID) => {
        var result = await Room.findOne({ "_id": roomID }).select('hostID');
        return result.hostID;
    },
    isJoinRoom: async (roomID, userID) => {
        var result = await Room.aggregate([
            { $match: { "_id": new mongoose.Types.ObjectId(roomID), "member": { $in: [userID] }, "hostID": { $ne: userID }, } },

        ])
        return result.length == 0 ? false : true;
    },
    inPendingList: async (roomID, userID) => {
        var result = await Room.find({ _id: roomID, "pendingRequest": { $in: [userID] } });
        return result.length == 1 ? true : false;
    },
    getRoomInfo: async (roomID) => {
        //const result = await Room.aggregate([{ $match: { "_id": mongoose.Types.ObjectId(roomID) }, }]);
        const result = await Room.findOne({ "_id": roomID }).lean(true);
        return result;

    },
    addRoom: async (accountID, roomInput) => {
        try {
            var roomInfo = _.assign(roomInput, {}, { "hostID": accountID, member: [accountID] })
            return await Room.create(roomInfo).then(async (value) => {
                var roomChatInput = { "roomID": value._id, "member": [accountID], message: [] }
                var result = await RoomChats.create(roomChatInput);
                await RoomChats.findByIdAndUpdate(result._id, { "roomID": value._id });
                return onSuccess("Create success!", value._id)
            })
        } catch (error) {
            return onError("Create failed!")
        }
    },



    editRoom: async (hostID, roomID, newData) => {
        // check token for hostID
        try {
            await Room.findOneAndUpdate(
                { "_id": roomID },
                {
                    $set: newData
                },
                { upsert: true, 'new': true });
            return true;
        } catch (error) {
            return false;
        }

    },
    updateRoom: async (hostID, roomID, update) => {
        try {
            await Room.findOneAndUpdate({ _id: roomID }, update);
            return true;
        } catch (error) {
            return false;
        }
    },

    deleteRoom: async (roomID, userID) => {
        // implement check token here
        var result = await Room.deleteOne({ "_id": roomID });
        return result.ok == 1 ? true : false;
    },
    deleteRequest: async (accountID, requestID) => {
        // host delete request

        var isHost = await Room.find({ "_id": roomID, "hostID": accountID }).countDocuments() == 0 ? false : true;
        var roomID = await ApproveList.findOne({ _id: requestID }).select('roomID');
        if (isHost) {
            await ApproveList.deleteOne({
                "hostID": accountID,
                "roomID": roomID
            })
            var result = await Room.findOneAndUpdate({ _id: roomID }, { $pull: { "pendingRequest": accountID }, $push: { "blacklist": accountID } })
            if (result.ok == 1) return true;
            return false;
        } else {
            var deleteResponse = await ApproveList.deleteOne({
                _id: requestID
            })

            if (deleteResponse.ok == 1) {
                var result = await Room.findOneAndUpdate({ _id: roomID }, { $pull: { "pendingRequest": accountID } })
                return true;
            }
            return false;

        }

    },
    acceptRequest: async (hostID, requestID, roomID) => {
        var result = await ApproveList.findOne({
            _id: requestID,
        }).select('requestID');

        var deleteResult = await ApproveList.deleteOne({ _id: requestID });

        if (deleteResult.ok == 1) {

            // add user to this room
            await Room.findByIdAndUpdate(
                roomID,
                { $push: { "member": result.requestID }, $pull: { "pendingRequest": result.requestID } });
            await RoomChats.findOneAndUpdate({ roomID: roomID }, { $push: { "member": result.requestID } })
            return true;
        }
        else return false;
    },
    removeMember: async (roomID, memberID) => {

        var result = await Room.findOneAndUpdate({ _id: roomID },
            { $pull: { "member": { $in: [memberID]} },$push: { "blacklist": memberID } },
            
            {
                new: true,
                upsert: true,
                rawResult: true,
                unique: true
            });
        
        if (result.ok == 1) {
            return true;
        }
        return false;
    }


}