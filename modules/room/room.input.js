const { gql } = require('apollo-server');
module.exports = typeDef = gql`

  input GameInfo{
      gameID:String!
      gameName:String
      platform:Platforms
  }
  input RoomInput{
      roomName:String!
      roomType:RoomTypeEnum!
      description:String
      member:[String]
      maxOfMember:Int!
      game:GameInfo
      code:String
      roomLogo:String
      roomBackground:String
      isFindingMember:Boolean
    }
`