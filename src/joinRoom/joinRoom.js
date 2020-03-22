const { } = require('../../models/room');


module.exports = {
    joinRoom : (roomID, currentUserID, info) => {

        /**
             * 
             * @param {userID} "user join room" 
             * @param {roomID} "room user join" 
             * @param {Info} "info need for approve list"
             */

        //check userID is not host

        return Room.aggregate([{ $match: { "roomID": roomID, "hostID": currentUserID }, }]).then((v) => {
            console.log(v.length);

            if (v.length < 1) {
                return ApproveList.find({ "roomID": roomID }).then((v) => {
                    console.log(v.length);

                    if (v.length < 0) {
                        return onError('fail', "You has been joined room, choose another room")
                    }
                    else return ApproveList.create(info).then((v) => {
                        pubsub.publish([JOIN_ROOM], { "user": currentUserID, joinTime: Date.now() })

                        return onSuccess("Waiting for apporove");;

                    })
                })
            }
            else {
                return onError('fail', "You are host");
            }

        })
    }
};
