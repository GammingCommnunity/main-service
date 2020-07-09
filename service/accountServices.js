const { fetch } = require('cross-fetch');
const env = require('../env');
const {getAccountsInfo,getThisAccount} = require('../graphql/query/query');
module.exports = {
    getAccountInfo: async (token) => {
        var fetchData = await fetch(env.subService, {
            method: "POST",
            headers: { "Content-Type": "application/json", token: token },
            body: JSON.stringify({
                query: getThisAccount
            }),
        });
        var result = await fetchData.json();
        //res = JSON.stringify(result);        
        return result.data.getThisAccount;        
    }
}