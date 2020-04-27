const { gql } = require('apollo-server');
module.exports = typeDef = gql`
 type PrivateChatInfo{
            member: [Profile]
        }
        type Profile{
            id: String,
            profile_url: String
        }
        extend type Query{
            getPrivateChatInfo(roomID:String):PrivateChatInfo
           getRoomChatInfo(groupID:String):RoomChat
        }
        extend type Mutation{
            chatPrivate(currentUserID:String,friendID:String,input:MessageInput):ResultCRUD
            createPrivateChat(input:CreateChatInput):ResultCRUD
            deleteMessage(currentUserID:String!,friendID:String!,messageID:String!):ResultCRUD

        }
`
