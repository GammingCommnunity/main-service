const requestSchema = require('./request.schema');
const requestType = require('./request.type');
const requestresolver = require('./request.resolvers');
module.exports = {
    RequestModule: () => [requestType,requestSchema],
    RequestResolvers: requestresolver
}