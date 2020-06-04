module.exports = {
    getAccountsInfo: (ids) => `query{
        lookAccount(ids:[${ids}]){
            account{
                id
                name
                avatar_url
            }
        }
    }`,
    getThisAccount: `query{
         getThisAccount{
            id
        }
    }`
}