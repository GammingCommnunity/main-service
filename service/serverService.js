const env = require('../env');
const mongoose = require('mongoose');
var io = require('socket.io-client');
const Redis = require('ioredis');
Redis.Promise = require("bluebird");

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

        io.connect(env.socketURL, {
            'transports': ["websocket"],
            'extraHeaders': { "auth_code": code },
        })
    },
    initRedisServer: () => {
        const redis = new Redis(
            {
                enableOfflineQueue: false,
                showFriendlyErrorStack: true,
                host: '127.0.0.1',
                port: 6379
            })
        // 
        redis.monitor((err, monitor) => {
            monitor.on("monitor", (time, args, source, database) => {
                console.log(`Redis -> ${args}`);

            });
        });
        return redis;

    }
}