const { gql } = require("apollo-server");

module.exports = typeDef = gql`
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
    enum GroupSize{
        small
        large
    }
`;