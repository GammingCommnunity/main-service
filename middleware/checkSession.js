require('dotenv').config();
const fetch = require('node-fetch');
module.exports = async (req, res, next) => {
    const authUrl = "https://caterwauling-torta.glitch.me/auth";
    //console.log(req.headers.token, process.env.secret_key_jwt);
    if (req.headers.token == (null || undefined) ){
        res.status(403).send({
            success: false,
            message: 'Error. Check your token'
        });
    }
    else{
        const response = await fetch(authUrl, {
            headers: {
                "token": req.headers.token,
                "secret_key": process.env.secret_key_jwt
            }
        });

        //if(link.stats)
        //console.log(response.status == 200);

        if (response.status != 200) {
            res.status(403).send({
                success: false,
                message: 'Error. Check your token'
            });
        }
        else {
            next()
        }
    }

}