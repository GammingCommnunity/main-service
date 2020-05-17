const subResolver = require('./subscription.resolvers');
const subSchema = require('./subscription.schema');
module.exports = {
    SubscriptionModule: () => [subSchema],
    SubscriptionResolvers:subResolver
}