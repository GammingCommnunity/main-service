const serverService = require('../service/serverService');
const redis = serverService.initRedisServer();
class RedisService{
    async isKeyAvailable(key,field) {
        var result = await redius.hget(key, field);
        return result == null ? false : true;
    }
    async setKey(key,field, value) {
        return await redis.hset(key, field, value);
    }
    async getValueByKey(key,field) {
        return await redis.hget(key, field);
    }
    getValueByKeyMD(key, field) {
        
        
        //console.log({ $concat: [await redis.hget(`${key}`, field), ""] });
        
        //return await redis.hget(id, field);
    }
}
module.exports = RedisService;