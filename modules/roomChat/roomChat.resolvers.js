const RoomChats = require('../../models/chat_room');
const {getUserID} = require('../../src/util')
const mongoose = require('mongoose');
const { onError, onSuccess } = require('../../src/error_handle');
const { checkHost} = require('../../service/roomService');
/*----------------------------------------------------------------------*/
const { PubSub, PubSubEngine, withFilter } = require('apollo-server');
const pubsub = new PubSub();
const GROUP_MESSAGE = 'GROUP_MESSAGE';
/*----------------------------------------------------------------------*/

const _ = require('lodash');
module.exports = resolvers = {
    Query: {
        getRoomMessage: async (root, { roomID, limit, page = 1 }, context) => {
            var accountID = getUserID(context);
            return RoomChats.aggregate([
                {
                    $match: { "roomID": roomID}
                },
                
                { $unwind: "$messages" },
                {
                    $sort: {
                        'messages._id': -1
                    }
                },
                { $skip: page <= 1 ? 0 : (page * 10 - 10) },
                { $limit: limit },
                {
                    $group: {
                        _id: '$_id',
                        message: { $push: '$messages'},
                    }
                }
            ]).then((v) => {
                return v[0].message
                
            }).catch((e) => {
                return []
                
            })
        },
        getRoomChatInfo: async (_, { groupID }) => {
            return RoomChats.findOne({ "roomID": groupID }).select(["member", "roomID"]).then((v) => {
                return v
            }).catch((err) => {

            });
        },
        getAllRoomChat: async (_, { }, context) => {
            var accountID = getUserID(context);
            var isHost = checkHost(accountID)
       
            return RoomChats.find({"member":{$in:accountID}})
        }
    },
    Mutation: {
        async chatRoom(root, { roomID, messages }, context) {
            var accountID = getUserID(context);
            const newResult = _.assign({}, messages, { "sender": accountID });

            return RoomChats.findOneAndUpdate({ "roomID": roomID }, { $push: { messages: newResult } }).then(v => {
                const now = new Date().toISOString();
                const messges = {
                    "groupID": roomID,
                    "type": messages.type,
                    "senderID": accountID,
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
        deleteMessage: async (root, { currentUserID, friendID, messageID }, context) => {
            var accountID = getUserID(context);
           
            return ChatPrivate.findOneAndUpdate(
                {
                    $and: [{ "currentUser.id": accountID },
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
        }, RmvMbFrRoom: async (root, { type, memberID, roomID }) => {
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
                return Room.findOneAndUpdate({ _id: idRoom }, { $pull: { "member": { "_id": { $in: [memberID] } } } }, { rawResult: true }).then(value => {
                    console.log(value);
                    if (value) { return { "data": value, "result": true } }
                }).catch(err => {
                    console.log("err " + err);

                    return { err, "result": false }
                });
            }

        },
    }
}