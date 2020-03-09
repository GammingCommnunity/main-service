const mongoose = require('mongoose');
require('dotenv').config()

module.exports = mongoose.createConnection(process.env.db_connection2, { useUnifiedTopology: true, useNewUrlParser: true })
