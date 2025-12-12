const mongoose = require('mongoose');
const { DB_CONNECTION_STRING } = require("../config");

module.exports = function () {
    mongoose.connect(DB_CONNECTION_STRING)  // no options needed
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.error(err));
};