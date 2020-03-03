const { gql,AuthenticationError } = require('apollo-server');
const { makeExecutableSchema } = require('apollo-server-express');
const Resolvers = require('./resolver');

const typeDefs = gql`
    
    union ResultTest= Room|Game  
    scalar Upload
    scalar Date
    enum Platforms {
        windows
        xbox_one
        ps4
        android
        ios
        nitendo_switch
    }
    
    enum Genres{
        action
        advanture
        arcade
        casual
        fps
        multiplayer
        hack_n_slash
        loot
        sci_fi
        shooter
        indie
        tps
        horror
        turn_base
        strategy
        massive_muti
        simulation
        battle_royle
    }

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
        getSummaryByGameID(gameID:String!):[Game]
    }
    interface Message{
        _id:ID
        text: String,
        createAt: Date
    }
    type Profile{
        id:String,
        profile_url:String
    }
    type PrivateChat{
        currentUser:Profile
        friend:Profile
        messages:[
            
            PrivateChatMessages
        ]
    }
    
    type PrivateChatMessages implements Message{
        _id:ID
        user:Profile
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
        name:String
        genres:[String]
        platforms:[String]
        popularity:String
        logo:ImageInput
        images(limit:Int):[String]
        coverImage:ImageInput
        summary:String
        video:VideoType
    }
    type VideoType{
        trailer:String
        gameplay:[String]
    }
    type ImageInput{
        imageUrl: String,
        blur: String
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
        user:ProfileInput
        text:String!
        createAt:Date
    }
    input ProfileInput{
        id:String
        profile_url:String
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
        name:String! 
        genres:[Genres]
        platforms:[Platforms]
        popularity:String
        tag:[String]
        logo:imageInput
        images:[
            String
        ]
        coverImage:imageInput
        summary:String

    }
    input imageInput{
        imageUrl: String,
        blur: String
    }
    input CreateChatInput{
        currentUser:ProfileInput!
        friend:ProfileInput!
    }
     
    type Mutation{
        """
            ***Create  a game with 'input'***
        """
        createGame(input:GameInput):ResultCRUD
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

        deleteMessage(currentUserID:String!,friendID:String!,messageID:String!):ResultCRUD
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
