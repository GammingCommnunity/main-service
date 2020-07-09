require('dotenv').config();
const fetch = require('node-fetch');
const env = require('../env');
const { getAccountInfo } = require('../service/accountServices');
const RedisService = require('../service/redisService');
const redis = new RedisService();
module.exports = async (req, res, next) => {
    const authUrl = "https://auth-service.glitch.me/auth";
    var authCode = req.headers.auth_code;
    // res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   // header.Add("Access-Control-Allow-Origin", "*")
  //  header.Add("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    if (authCode == env.main_server_code) {
        next()
    }
    else {
        if (req.headers.token == (null || undefined)) {
            res.status(403).send({
                success: false,
                message: 'Error. Check your token'
            });
        }
        else {
            const response = await fetch(authUrl, {
                'mode': "no-cors",
                headers: {
                    "token": req.headers.token,
                    "secret_key": env.secret_key_jwt
                }
            });

            if (response.status != 200) {
                res.status(403).send({
                    success: false,
                    message: 'Error. Check your token'
                });
            }
            else {
                var result = await response.json();
                res.info = JSON.stringify(result);
                var accountInfo = await getAccountInfo(req.headers.token);
                await redis.setKey(accountInfo.id, 'account', JSON.stringify(accountInfo));
                
                next()
            }
        }
    }
    

}