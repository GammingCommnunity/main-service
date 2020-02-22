const { gql,AuthenticationError } = require('apollo-server');
const { makeExecutableSchema } = require('apollo-server-express');
const Resolvers = require('./resolver');

const typeDefs = gql`
    
    union ResultTest= Room|Game  
    scalar Upload
    scalar Date
    type Query{
        
        generateToken(id:String!):String
        """
        *** Support paginate, page is number of page u want to show value, 
        limit is number of values in one page ***
        """
        getAllRoom(page:Int!,limit:Int!):[Room]
        """
        *** Remove member from room,
        support 2 'type': remove all people ('all') and remove once people('once')***
        """
        RmvMbFrRoom(type:String!,userID:String,roomID:String):Result
        
        """ 
        ***Change host (require token)***
        """
        changeHost(oldHost:String!,newHost:String!):[Room]
        """
        ***Get room which created by user***    
        """
        getRoomCreateByUser(UserID:String):[Room]
        """
        ***Find room by name***
        """
        findRoomByName(room_name:String!):[Room]

        ## (Deperated) joinRoomChat(roomID:String,userID:String,Info:Info):ResultCRUD
        """ 
        ***Add member to room (require token)***
        """
        addMember(id_room:String!,id_user:String!):ResultCRUD
        
        chatGroup(id_room:String!,chat_message:MessageInput):Result
        
        getAllMessage(id_room:String!):RoomChat
        """ 
        ***Get list chat private message from userID*** 
        """
        getPrivateChat(ID:String):[PrivateChat]
        """
        ***Get all room chat***
        """
        getAllRoomChat:[RoomChat]
        """
        *** Get all game 
            spectify limit to get exactly values u want    ***
        """
        getListGame(limit:Int!):[Game]
        """
            (WIP)
        """
        getRandomGame:[Game]
        """
        *** Get all game by genre
            spectify ('type')  ***
        """
        getGameByGenre(type:String!):[Game]
        """
        *** Get userID that waiting for host to approve
            spectify ('type')  ***
        """
        approveList_Host(hostID:String!):[ApproveList]
        """
            (WIP)
        """
        approveList_User(userID:String!):[ApproveList]
        """
            *** get room by game, specify gameID to find***
        """
        getRoomByGame(gameID:String!):[Room]
        """
            *** get room by hostID, specify hostID to find***
        """
        roomManage(hostID:String!):[Room]
    }
    interface Message{
        text: String,
        createAt: Date
    }

    type PrivateChat{
        
        messages:[
            PrivateChatMessages
        ]
    }
    
    type PrivateChatMessages implements Message{
        
        text:String,
        createAt:Date
    }
    type pendingMessages{
        userID:String
        messages:[
            PrivateChatMessages
        ],
        createAt:Date
    }

    type incommingMessages {
        friendID:String
        messages:[
            PrivateChatMessages
        ]
        createAt:Date
    }
    
    type gameInfo{
        gameID:String!
        gameName:String!
    }
    """
    *** info: check when someone join, waiting for
            host approve. This userID will transfer to 
            ApproveList. ***
    """
    input Info{
        userID:String!,
        roomID:String!
    }
    type File {
        filename: String!
        mimetype: String!
        encoding: String!
      }
    type ApproveList{
        userID:String
        roomID:String
        isApprove:Boolean
    }
    type Room implements AuthResponse{
        _id:ID!
        roomName:String!
        idUser:String!
        hostID:String
        isPrivate:Boolean
        description:String
        game:gameInfo
        member:[String]
        maxOfMember:Int
        createAt:Date
        status:String!
    }
  
    type Game{
        _id:ID!
        game_name:String
        genres:[String]
        platforms:[String]
        popularity:String
        logo:String
        image(limit:Int):[String]
        cover_image:String
    }
   
    type ListMessage{
        userID:String!
        listmessage:[Message]
    }
  
    
    type JoinRoomResponse implements MutationResponse{
        status:String
        success: Boolean!
        message: String!
    
    }
    type UploadImage implements MutationResponse{
        code: String!
        success: Boolean!
        message: String!
        image_url:String
    }
    
    interface MutationResponse {
        success: Boolean!
        message: String!
    }
    interface AuthResponse{
        status:String!
    }
    
    type Result{
      data:Room
      status:String
      result:Boolean
    }
    type ResultCRUD implements MutationResponse{
        status:String
        success:Boolean!
        message:String!
    }
  
    type RoomChat{
        _id:ID!
        roomID:String
        member:[String]
        messages:[
            Message
        ]
    }
  
  
    input pendingMessage{
        id_user:String,
        messages:[String],
        time:String
    }
    input privateMessage{
        id_friend:String
        message:[String]
        time:String
    }
    input newMessage{
        username:String!
        listmessage:[
            MessageInput
        ]
    }
    input RoomInput{
        roomName:String!
        isPrivate:Boolean!
        hostID:String!
        description:String
        member:[String]!
        maxOfMember:Int!
        game:GameInfo
    }
   
    input GameInfo{
        gameID:String!
        gameName:String!
    }
   
    input MessageInput{
        text:String!
        createAt:Date
    }
  
    input RoomChatInput{
        member:[
            String
        ]
        messages:[
            MessageInput
        ]
        createAt:Date
    }
    input GameInput{
        _id:ID
        game_name:String
        genres:[String]
        platforms:[String]
        popularity:String
        tag:[String]
        logo:String
        image:[String]
    }
    input CreateChatInput{
        currentUserID:String!
        friendID:String!
    }
     
    type Mutation{
        """
            ***Create  a game with 'input'***
        """
        createGame(input:GameInput):Game
        """
            ***Create  a room chat with 'input'***
        """
        createRoomChat(input:RoomChatInput):RoomChat
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

        """ 
        ***Edit room info***
        """
        editRoom(roomID:ID!,hostID:ID!,newData:RoomInput):ResultCRUD

        """
            *** Chat with someone privately***

        """
        chatPrivate(
            currentUserID:String,
            friendID:String,
            input:MessageInput):ResultCRUD
        """
            *** (WIP) ***

        """
        chatUpdate(
            name:String!,
            input:MessageInput):ListMessage
        """
            *** 
            Join a room 

            ***

        """
        joinRoom(
            roomID:String!,
            currentUserID:String!,
            
            info:Info!):ResultCRUD
        createPrivateChat(input:CreateChatInput):ResultCRUD
        """
            *** (No usage) ***

        """
        upload(
            file: Upload!,
            userID:String,
            type:Int):UploadImage
    }
`;


const schema = makeExecutableSchema({
    typeDefs: typeDefs,

    resolvers:
        Resolvers,
    
});
module.exports = schema;
