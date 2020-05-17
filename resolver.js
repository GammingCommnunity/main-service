require('dotenv').config();
var cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const { Room } = require('./models/room')
const RoomChats = require('./models/chat_room');
const { ListGame } = require('./models/list_game');
const ChatPrivate = require('./models/chat_private/chat_private');
const { GraphQLUpload } = require('graphql-upload');
const { AuthenticationError } = require('apollo-server')
const { sign, verify } = require('jsonwebtoken');
const { Genres, Platforms, MessageType } = require('./src/enum');
const { GamesRadars, PCGamer } = require('./models/News/News');


const JOIN_ROOM = 'JOIN_ROOM';


module.exports = resolvers = {
    Upload: GraphQLUpload,
    Date: Date,
    //import enum type here
    Genres, Platforms, MessageType,

   
    Query: {

        async changeHost(root, { oldHost, newHost }) {


        },
        async findRoomByName(root, { room_name }) {

            return Room.find({ "roomName": { '$regex': room_name, $options: 'i' } });
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
        
    },
    Mutation: {

        //them tin nhan vao group chat 
       
        
        createRoomBackground: async (_, { input }) => {

            return RoomBackground.create(input).then((v) => {
                return { status: 200, "success": true, "message": "Create success!" }
            }).catch((err) => {
                return { status: 200, "success": false, "message": "Create fail!" }
            });
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

