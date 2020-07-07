const ApproveList = require('../../models/approve_list');
const { checkRequestExist, addApprove,getRequestInfo} = require('../../service/requestService');
const { onError, onSuccess } = require('../../src/error_handle');
const { getUserID } = require('../../src/util');
const { deleteRequest, acceptRequest,getRoomInfo } = require('../../service/roomService');
const { PubSub, PubSubEngine, withFilter } = require('apollo-server');
const pubsub = new PubSub();
const ACCEPT_REQUEST = 'ACCEPT_REQUEST';
module.exports = resolvers = {
    Subscription: {

        acceptRequest: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('ACCEPT_REQUEST'),
                (payload, variable, context) => {
                    return payload.acceptRequest.receiverID === context.currentUser

                }
            )
        },
    },
    Query: {
        // show ra nhung phong host ma co thanh vien cho 
        manageRequestJoin_Host: async (root, { }, context) => {
            var accountID = getUserID(context);
            return ApproveList.aggregate([{ $match: { "hostID": accountID } }]).then((v) => {
                return v;
            });

        },
        // show ra nhung phong user dang cho duoc duyet 
        getPendingJoinRoom_User: async (root, { }, context) => {
            var accountID = getUserID(context);

            return ApproveList.aggregate([{ $match: { "userID": accountID } }]).then((v) => {
                return v;
            })
        },
    },
    Mutation: {
        acceptUserRequest: async (_, { requestID}, context) => {
            var accountID = getUserID(context);
            var requestInfo = await getRequestInfo(requestID);
            var roomInfo = await getRoomInfo(requestInfo.roomID);
            
            var result = await acceptRequest(accountID, requestID, requestInfo.roomID);
            const notify = {
                receiverID: requestInfo.requestID,
                message: `Now you're a member of ${roomInfo.roomName}`,
                time: new Date().toLocaleString("vi-VI", { timeZone: "Asia/Ho_Chi_Minh" }),
            }
            console.log(notify);
            
            if (result) {
                pubsub.publish(ACCEPT_REQUEST, { acceptRequest: notify})
                return onSuccess("OK")
            }
            else return onError("fail", "Has error, try again")
        },
        cancelRequest: async (_, {requestID},context) => {
            var accountID = getUserID(context);

            var result = await deleteRequest(accountID,requestID);
            return result ? onSuccess("Cancel success") : onError("fail", "Has error");
        },

    }

}