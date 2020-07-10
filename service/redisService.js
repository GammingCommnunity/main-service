const serverService = require('../service/serverService');
const redis = serverService.initRedisServer();
class RedisService{
    async isHKeyAvailable(key,field) {
        var result = await redis.hget(key, field);
        return result == null ? false : true;
    }
    async setHKey(key,field, value) {
        return await redis.hset(key, field, value);
    }
    async getValueByHKey(key,field) {
        return await redis.hget(key, field);
    }
    getValueByHKeyMD(key, field) {
        
        
        //console.log({ $concat: [await redis.hget(`${key}`, field), ""] });
        
        //return await redis.hget(id, field);
    }
}
module.exports = RedisService;