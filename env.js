require('dotenv').config();
module.exports = {
    socketURL: "https://socketchat.glitch.me/",
    secret_key_jwt: process.env.secret_key_jwt,
    db_connection: process.env.db_connection,
    main_server_code: process.env.main_server_code
}