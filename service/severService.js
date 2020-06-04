const env = require('../env');
const mongoose = require('mongoose');
var io = require('socket.io-client');
module.exports = {
    initMongoDBServer: () => {
        mongoose.Promise = global.Promise;
        mongoose.set('useFindAndModify', false);
        mongoose.set('debug', true);
        mongoose.connect(env.db_connection, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }, (res, err) => {
            console.log('Connected to MongoDB');
        })
    },
    initSocketServer: (code) => {
        
        io.connect('http://localhost:7000', {
            'transports': ["websocket"],
            'extraHeaders': { "auth_code": code },
        })
    }
}