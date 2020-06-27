const { gql } = require('apollo-server');
module.exports = typeDef = gql`

        type PrivateChat{
            _id:ID
            member:[String]
            isHost:Boolean
            latest_message:PrivateMessagesType
        }

        extend type Query{
            """
            *** Lấy tất cả các chát riêng tư ***
            """
            getAllPrivateChat(ids: [String] = [],page:Int! = 1,limit:Int! = 10):[PrivateChat]
            """
            *** Lấy tất cả các tin nhắn, có pagiante , page tăng dần từ 1 -> n,limit (muốn lấy bao nhiêu tin nhắn) ***
            """
            getPrivateChatMessage(chatID:String!,page:Int!,limit:Int!):[PrivateMessagesType]
            """
            *** Lấy thông tin của chat riêng tư , có vẻ ko cần thiết ***
            """
            getPrivateChatInfo(roomID:String):String
            getPrivateMedia(chatID:String):[Media]
        }
        extend type Mutation{
            chatPrivate(friendID:String!,input:MessageInput!):ResultCRUD
            createPrivateChat(input:PrivateChatInput):ResultCRUD
            reactionMessage(chatID:String!,messageID:String!,reactionType:Reaction):ResultCRUD
            deletePrivateChat(chatID:String!):ResultCRUD
            deleteMessage(currentUserID:String!,friendID:String!,messageID:String!):ResultCRUD

        }
`