const ChatPrivate = require('..//../models/chat_private/chat_private');
const mongoose = require('mongoose');
const _ = require('lodash');
const RECIEVE_MESSAGE = 'RECIEVE_MESSAGE';
const { onError, onSuccess } = require('../../src/error_handle');
const { getUserID } = require('./..//../src/util');
const subService = require('../../service/subService')
module.exports = resolvers = {
    Query: {
        getAllPrivateChat: async (root, {ids, page , limit }, context) => {
            //subService.getAccountsInfo(context.token,)
            var accountID = getUserID(context);
            console.log(ids);
            
            return ChatPrivate.aggregate([
                
               // { $unwind: "$member" },
               // { $unwind: "$messages" },
                 
                { $skip: page <= 1 ? 0 : (page * 10) },
                { $limit: limit },
                {
                    $project: {                        
                        "data": {
                            $cond: [
                                ids.length == 0 ? true : false,
                                //ids == [] ? true : false,
                                {
                                    _id: "$_id",
                                    isHost: {
                                        $cond: [
                                            { $eq: ["$host", accountID] },
                                            true,
                                            false
                                        ]
                                    },

                                    member: "$member",
                                    latest_message: { $arrayElemAt: ["$messages", -1] }
                                }, 
                                {
                                 
                                   $cond: [
                                        {
                                            $and: [
                                              //  { $in: [ids, "$member"] },
                                                {
                                                    $filter: {
                                                        input: ids,
                                                        as: "id",
                                                        cond: {
                                                            $and: [

                                                                { $in: ["$$id", "$member"] },
                                                                //{ $eq: ["$host", accountID] }
                                                            ]

                                                        }
                                                    }
                                                },
                                                {
                                                    $or: [
                                                        {
                                                            $in: [accountID, "$member"]
                                                        },
                                                        {
                                                            $eq: [accountID, "$host"]
                                                        }
                                                   ]
                                               }
                                            ]
                                        },
                                        {
                                            _id: "$_id",
                                            isHost: {
                                                $cond: [
                                                    { $eq: ["$host", accountID] },
                                                    true,
                                                    false
                                                ]
                                            },
                                            host:"$host",
                                            member: "$member",
                                            latest_message: { $arrayElemAt: ["$messages", -1] }
                                        },
                                        null
                                    ]
                                    
                                },
                                
                            ]
                        }
                        
                    }
                },
                
                {
                    $match: {
                        "data": {
                            "$exists": true,
                            "$ne": null,
                            
                        },
                        
                    }
                },
                
                {
                    $replaceRoot: {
                        newRoot: "$data"
                    }

                },
               
            ])
          
            
            //return ChatPrivate.find({"member":{$in:[accountID]}});
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
        getPrivateChatMessage: async (root, { chatID, limit, page = 1 }, context) => {
            var accountID = getUserID(context);
            var myAggresgate = ChatPrivate.aggregate([

                { $match: { '_id': new mongoose.Types.ObjectId(chatID) } },
                { $unwind: "$messages" },
                {
                    $sort: {
                        'messages._id': -1
                    }
                },
                { $skip: page <= 1 ? 0 : (page * 10) },
                { $limit: limit },
                {
                    $group: {
                        _id: '$_id',
                        message: { $push: '$messages' },
                    }
                },
            ])
            return ChatPrivate.aggregatePaginate(
                myAggresgate).then((v) => {

                    return v.docs[0].message

                }).catch((_) => {
                    return []
                })
            /* // cond 1: ID is the host
    
             return ChatPrivate.find({
                 $and: [
                     { $or: [{ "currentUser.id": accountID }, { "friend.id": accountID }] },
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

    },

    Mutation: {
        async createPrivateChat(root, { input }, context) {

            var currentID = getUserID(context);
            var member = [currentID, input.friendID];

            var newInput = _.assign({}, input, { "host":currentID,"member": member });

            return ChatPrivate.create(newInput).then((v) => {
                return onSuccess("Create success!",v._id)
            }).catch((v) => {
                return onError('fail', "Create fail...")
            });
        },
        deletePrivateChat: async (root, { chatID }, context)=>{
            var currentID = getUserID(context);
            // delete private chat if you are host

            // remove from member if you are not host
        },
        reactionMessage: async (root, {chatID, messageID, type }, context) => {
            var accountID = getUserID(context);
            
        },
        chatPrivate: async(root, { friendID, input }, context)=> {
            //condition 1: sender is current User
            var accountID = getUserID(context);

            var message = _.assign({}, input, { id: accountID })
            return ChatPrivate.findOneAndUpdate(
                { $and: [{ "member": accountID }, { $and: [{ "member": friendID }] }] }, { $push: { messages: message } }
            ).then(async (v) => {
                // condition 2: sender is guest.
                if (v == null) {
                    return ChatPrivate.findOneAndUpdate(
                        { $and: [{ "member": accountID }, { $and: [{ "member": friendID }] }] }, { $push: { messages: message } }
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
    }
}