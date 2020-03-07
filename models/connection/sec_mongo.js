const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.set('debug', true);
mongoose.connect(process.env.db_connection, { useUnifiedTopology: true, useNewUrlParser: true }, (res, err) => {

    console.log('Connected to MongoDB');
})
module.exports = mongoose