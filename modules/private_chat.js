const { gql } = require('apollo-server');
module.exports = typeDef = gql`
        type PrivateChatInfo{
            member: [Profile]
        }
        type Profile{
            id: String,
            profile_url: String
        }
         
        type PrivateChat{
            _id:ID
            member:[String]
            messages:[
                PrivateChatMessages
            ]
        }
       
        type facelet{
            data:[PrivateChatMessages]
        }
        extend type Query{
            getAllPrivateChat:[PrivateChat]
            getPrivateChat(chatID:String!,page:Int!,limit:Int!):[PrivateChatMessages]
            getPrivateChatInfo(roomID:String):PrivateChatInfo
            getRoomChatInfo(groupID:String):RoomChat
        }
        extend type Mutation{
            chatPrivate(currentUserID:String,friendID:String!,input:MessageInput!):ResultCRUD
            createPrivateChat(input:PrivateChatInput):ResultCRUD
            deleteMessage(currentUserID:String!,friendID:String!,messageID:String!):ResultCRUD

        }
`
