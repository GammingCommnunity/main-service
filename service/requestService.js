const ApporoveList = require('./../models/approve_list');
module.exports = {
    checkRequestExist: async (roomID, userID) => {
        const result = await ApporoveList.find({ "roomID": roomID, "userID": userID });
        return result.length == 1 ? true : false;
    },
    addApprove: async (data) => {
        try {
            return await ApporoveList.create(data);
           
        } catch (error) {
            return null;
        }
    }
}