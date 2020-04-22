const { gql, AuthenticationError } = require('apollo-server');
const { makeExecutableSchema } = require('apollo-server-express');
const Resolvers = require('./resolver');

const typeDefs = gql`
    
    scalar Upload
    scalar Date

    enum SortEnum{
        DESC
        ASC
    }
    enum Platforms {
        windows
        xbox_one
        ps4
        android
        ios
        nitendo_switch
    }
    
    enum Genres{
        zombies
        co_op
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
        rts
        rpg
    }
    enum MessageType{
        text
        media
    }
    type userSubscription{
        roomName:String
        userID:String
        joinTime:Date
        isApprove:Boolean
    }
    type messageSubscription{
        message:String
        senderID:String
        sendDate:Date
    }
    type groupSubcription{
        groupID:String
        senderID:String
        message:String
        sendDate:Date
    
    }
    type Subscription{
        onJoinRoom(hostID:String): userSubscription
        recieveNewMessage:messageSubscription
        """
        *** only listen to new message from groupID
        """
        groupNewMessage(groupID:String):groupSubcription
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
        getRoomCreateByUser(userID:String):[Room]
        """
        ***Find room by name***
        """
        findRoomByName(room_name:String!):[Room]

        ## (Deperated) joinRoomChat(roomID:String,userID:String,Info:Info):ResultCRUD
       
        
        
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
        countRoomOnEachGame(sort:SortEnum!):[Game]
        fetchNews(name:String!,page:Int,limit:Int):[News]
        getRoomMessage(roomID:String!):RoomChat
        searchGame(name:String):Game
        getRoomJoin(userID:String):[Room]
        getPrivateChatInfo(roomID:String):PrivateChatInfo
        getRoomChatInfo(groupID:String):RoomChat
        getPrivateMedia(chatID:String):[Media]
        getRoomMedia(roomID:String):[Media]
        inviteToRoom(hostID:String,roomID:String):ResultCRUD

    }
    type Media{
        text:String,
        createAt:Date
    }
    type PrivateChatInfo{
        member:[Profile]
    }
    type RoomMessage{
        _id:ID
        messageType:String
        id:String
        text: TextMessageType,
        createAt: Date
    }
    type TextMessageType{
        content:String
        height:Float
        width:Float    
    }

    type News{
        article_url:String,
        article_short:String,
        article_image:String,
        release_date:String
    }
    
    type Profile{
        id:String,
        profile_url:String
    }
    type PrivateChat{
        _id:ID
        currentUser:Profile
        friend:Profile
        messages:[
            PrivateChatMessages
        ]
    }
    
    type PrivateChatMessages{
        _id:ID
        messageType:String
        id:String
        text:TextMessageType,
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
        hostID:String!
        userID:String!
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
        hostID:String
        isPrivate:Boolean
        description:String
        game:gameInfo
        member:[String]
        maxOfMember:Int
        createAt:Date
        status:String!
        code:String!
    }
  
    type Game{
        _id:ID!
        name:String
        genres:[String]
        platforms:[String]
        popularity:String
        logo:ImageType
        images(limit:Int):[String]
        tag:[String]
        banner:String
        coverImage:ImageType
        summary:String
        video:VideoType
        background:String
        count(DESC:String):Int
    }

    type VideoType{
        trailer:String
        gameplay:[String]
    }
    type ImageType{
        imageUrl: String,
        blur: String
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
        status:Int
        payload:String
        success:Boolean!
        message:String!
        
    }
  
    type RoomChat{
        
        roomID:String
        member:[String]
        messages:[
            RoomMessage
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
        platform:Platforms
    }
   
    input MessageInput{
        messageType:MessageType
        id:String
        text:Custom!
        createAt:Date
    }
    input Custom{
        content:String
        height:Float
        width:Float
    }
    input ProfileInput{
        id:String
        profile_url:String
    }

    input RoomChatInput{
        roomID:String
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
        banner:String
        logo:imageInput
        images:[
            String
        ]
        coverImage:imageInput
        summary:String
        video:VideoInput

    }

    input VideoInput{
        trailer:String!,
        gameplay:String
    }

    input imageInput{
        imageUrl: String,
        blur: String
    }

    input CreateChatInput{
        currentUser:ProfileInput!
        friend:ProfileInput!
        messages:MessageInput
    }

    input RoomBackgroundInput{
        name:String!,
        gameID:String,
        background:BackgroundInput
    }
    input BackgroundInput{
        url:String,
        blur:String
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
        ***Add member to room (require token)***
        """
        addMember(roomID:String!,userID:String!):ResultCRUD

        
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
            
        chatRoom(roomID:String!,messages:MessageInput):ResultCRUD
        
        """
            *** 
            Join a room 
            ***

        """
        joinRoom(
            roomID:String!,
            currentID:String!,
            info:Info!):ResultCRUD
        
        createPrivateChat(input:CreateChatInput):ResultCRUD

        deleteMessage(currentUserID:String!,friendID:String!,messageID:String!):ResultCRUD
        """
            *** (No usage) ***

        """
        createRoomBackground(input:RoomBackgroundInput):ResultCRUD
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
