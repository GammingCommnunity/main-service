const { fetch } = require('cross-fetch');
const env = require('../env');
const queries = require('../graphql/query/query');
module.exports = {
    getAccountsInfo: async (token, ids) => {
        var mapped = ids.map(function (x) { return parseInt(x) });
       try {
           var response = await fetch("http://hutech.tech/graphql", {
               method: "POST",
               headers: {
                   'Content-Type': 'application/json',
                   'Accept': 'application/json',
                   "token": token
               },
               body: JSON.stringify({
                   query: queries.getAccountsInfo(ids)
               })
           })
           var result = await response.json();
           return result;
       } catch (error) {
           console.log(JSON.parse(error));
           
       }

    }
}