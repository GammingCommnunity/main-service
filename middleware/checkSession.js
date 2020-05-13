require('dotenv').config();
const fetch = require('node-fetch');
module.exports = async (req, res, next) => {
    // res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   // header.Add("Access-Control-Allow-Origin", "*")
  //  header.Add("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const authUrl = "https://caterwauling-torta.glitch.me/auth";
    //console.log(req.headers.token, process.env.secret_key_jwt);

    if (req.headers.token == (null || undefined)) {
        res.status(403).send({
            success: false,
            message: 'Error. Check your token'
        });
    }
    else {
        const response = await fetch(authUrl, {
            'mode':"no-cors",
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
            var result = await response.json();
            res.info = JSON.stringify(result);
            next()
           
            
        }
    }

}