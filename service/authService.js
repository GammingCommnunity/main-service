const fetch = require('node-fetch');
const env = require('../env');
require('dotenv').config();

module.exports = async (token) => {
    const authUrl = "https://auth-service.glitch.me/auth";
    const response = await fetch(authUrl, {
        'mode': "no-cors",
        headers: {
            "token": token,
            "secret_key": env.secret_key_jwt
        }
    });
    if (response.status != 200) {
        throw new Error('Invalild token!');
    }
    else {
        var result = await response.json();
        //var info = JSON.stringify(result);
        return {
            currentUser: `${result.data.accountId}`
        }
    }

}