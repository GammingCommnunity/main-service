const { gql } = require('apollo-server');
module.exports = typedef = gql`
    type Mutation{
        createRoomBackground(input: RoomBackgroundInput): ResultCRUD

    }

`

