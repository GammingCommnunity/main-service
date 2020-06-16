const { fetch } = require('cross-fetch');
const { Room } = require('../models/room');
const RoomChats = require('../models/chat_room');
const ApproveList = require('../models/approve_list');
const { onError, onSuccess } = require('../src/error_handle');
const env = require('../env');
const _ = require('lodash');
var crypto = require("crypto");

module.exports = {
    generateInviteCode: () => crypto.randomBytes(3).toString('hex'),
    checkHost: async (roomID, userID) => {
        const result = await Room.find({ "_id": roomID, "hostID": userID }).countDocuments();

        if (result > 0) {
            return true;
        }
        else {
            return false;
        }
    },
    initGroupPost: async (groupID,needApproved, token) => {
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
    getHostID: async (roomID) => {
        var result = await Room.findOne({ "_id": roomID }).select('hostID');
        return result.hostID;
    },
    isJoinRoom: async (roomID, userID) => {
        var result = await Room.aggregate([{ $match: { "member": { $in: [userID] }, "hostID": { $ne: userID }, "_id": roomID } }]);
        return result.length == 1 ? true : false;
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
    deleteRequest: async (accountID, roomID, requestID) => {
        // host delete request

        var isHost = await Room.find({ "_id": roomID, "hostID": accountID }).countDocuments() == 0 ? false : true;

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
        }).select('userID');
        console.log(result);

        var deleteResult = await ApproveList.deleteOne({ _id: requestID });

        if (deleteResult.ok == 1) {

            // add user to this room
            console.log(result);

            await Room.findByIdAndUpdate(
                roomID,
                { $push: { "member": result.userID }, $pull: { "pendingRequest": result.userID } });
            await RoomChats.findOneAndUpdate({ roomID: roomID }, { $push: { "member": result.userID } })
            return true;
        }
        else return false;
    },


}