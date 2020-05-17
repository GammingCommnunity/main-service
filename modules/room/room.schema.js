const { gql } = require('apollo-server');
module.exports = typeDef = gql`
    type Room{
        _id:ID!
        roomName:String!
        hostID:String
        isPrivate:Boolean
        description:String
        game:gameInfo
        member:[String]
        maxOfMember:Int
        createAt:Date
        code:String!
        roomLogo:String
        roomBackground:String
        isJoin:Boolean
        isRequest:Boolean
    }
    type gameInfo{
        gameID:String!
        gameName:String!
    }
   

   extend type Query{
        """
        *** Support paginate, page is number of page u want to show value, 
        limit is number of values in one page ***
        """
        getAllRoom(page:Int!,limit:Int!):[Room]
        getRoomInfo(roomID:String):Room
        findRoomByName(room_name:String!):[Room]
        getRoomCreateByUser:[Room]
        changeHost(oldHost:String!,newHost:String!):[Room]
        getRoomByGame(limit:Int!,page:Int!,gameID:String!,groupSize:GroupSize):[Room]
        getRoomJoin(userID:String):[Room]
        getRoomMedia(roomID:String):[Media]
        inviteToRoom(hostID:String,roomID:String):ResultCRUD
        roomManager:[Room]
   }
   type Mutation{
        RmvMbFrRoom(type:String!,memberID:String,roomID:String):ResultCRUD
        """
            ***Create  a room with 'input'***
        """
        createRoom(
            userID:String,
            roomInput: RoomInput,
            roomChatInput:RoomChatInput):ResultCRUD
         
        """
            ***Remove  a room,
            MUST specify roomID.
            userID is must to auth ***

        """
        removeRoom(roomID:ID!,userID:String!):ResultCRUD
        chatRoom(roomID:String!,messages:MessageInput):ResultCRUD
        joinRoom(roomID:String!):ResultCRUD
        
        """ 
        ***Edit room info***
        """
        editRoom(roomID:ID!,hostID:String!,newData:RoomInput):ResultCRUD
        
        """ 
        ***Add member to room (require token)***
        """
        addMember(roomID:String!,memberID:String!):ResultCRUD
   
   }
`
// type RoomMessage{
//     _id: ID
//     messageType: String
//     id: String
//     text: TextMessageType,
//     createAt: Date
// }