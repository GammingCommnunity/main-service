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
        countMember:Int
        isJoin:Boolean
        isRequest:Boolean
    }
    type RoomAggregate{
        data:Room,
        additionData:AdditionData
        
    }
    type AdditionData{
        countMember:Int
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
        searchRoom(query:String!,gameID:String):[Room]
        getRoomCreateByUser:[Room]
        changeHost(oldHost:String!,newHost:String!):[Room]
        getRoomByGame(limit:Int!,page:Int!,gameID:String!,groupSize:GroupSize!):[Room]
        getRoomJoin:[Room]
        getRoomMedia(roomID:String):[Media]
        inviteToRoom(roomID:String!):ResultCRUD
        roomManager:[Room]
   }
   type Mutation{
        changeGroupPhoto(groupID:String!,type:GroupImage,url:String!):ResultCRUD
        RmvMbFrRoom(type:String!,memberID:String,roomID:String):ResultCRUD
        """
            ***Create  a room with 'input'***
        """
        createRoom(
            roomInput: RoomInput,needApproved:Boolean!):ResultCRUD
         
        """
            ***Remove  a room,
            MUST specify roomID.
            userID is must to auth ***

        """
        removeRoom(roomID:ID!):ResultCRUD
        chatRoom(roomID:String!,messages:MessageInput):ResultCRUD
        joinRoom(roomID:String!):ResultCRUD
        
        """ 
        ***Thay đổi thông tin phòng***
        """
        editRoom(roomID:ID!,newData:RoomInput):ResultCRUD
        
        """ 
        ***Thêm người vào phòng***
        """
        addMember(roomID:String!,memberID:String!):ResultCRUD
        leaveRoom(roomID:String!):ResultCRUD
   }
`
// type RoomMessage{
//     _id: ID
//     messageType: String
//     id: String
//     text: TextMessageType,
//     createAt: Date
// }