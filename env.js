require('dotenv').config();
module.exports = {
    socketURL: "https://socketchat.glitch.me/",
    subService: "http://hutech.tech/graphql",
    postService:"https://post-service.glitch.me/graphql",
    secret_key_jwt: process.env.secret_key_jwt,
    db_connection: process.env.db_connection,
    main_server_code: process.env.main_server_code
}