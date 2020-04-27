const { gql, AuthenticationError } = require('apollo-server');
const { makeExecutableSchema } = require('apollo-server-express');
const Resolvers = require('./resolver');
const Subscription = require('./modules/subscription/subscription');
const Scalar = require('./modules/scalar/custom_scalar');
const Enum = require('./modules/enum/enum');
const Room = require('./modules/room');
const Game = require('./modules/game');
const resultCRUD = require('./modules/type/crud_result');
const mediaType = require('./modules/type/media_type');
const privateChat = require('./modules/private_chat');
const roomChat = require('./modules/type/room_chat');
const news = require('./modules/news');
const textMessageType = require('./modules/type/text_mess_type');
const requestRoom = require('./modules/request_room');
const Input = require('./modules/input');
const typeDefs = gql`
    

    type Query{

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
        *** Get userID that waiting for host to approve
            spectify ('type')  ***
        """
        manageRequestJoin_Host(hostID:String!):[ApproveList]
        """
            (WIP)
        """
        getPendingJoinRoom_User(userID:String!):[ApproveList]
       
        """
            *** get room by hostID, specify hostID to find***
        """
        
        roomManage(hostID:String!):[Room]
          """
            *** get room by game, specify gameID to find***
        """
        
        
        
        getRoomMessage(roomID:String!):RoomChat
        
        
        
        getPrivateMedia(chatID:String):[Media]
        
        
 
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


    
    type File {
        filename: String!
        mimetype: String!
        encoding: String!
      }
    type ApproveList{
        _id:ID
        userID:String
        roomID:String
        isApprove:Boolean
    }
    

    type UploadImage{
        code: String!
        success: Boolean!
        message: String!
        image_url:String
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
        

        createRoomBackground(input:RoomBackgroundInput):ResultCRUD
        
        
        upload(
            file: Upload!,
            userID:String,
            type:Int):UploadImage
    }
`;

const schema = makeExecutableSchema({
    
    typeDefs: [
        typeDefs,
        Scalar,
        Subscription,
        Enum,
        Input,
        Room,
        Game,
        privateChat,
        resultCRUD,
        roomChat,
        news,
        textMessageType,
        mediaType,
        requestRoom
    ],

    
    resolvers:
        [Resolvers],

});
module.exports = schema;
