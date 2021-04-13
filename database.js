const mongoose = require('mongoose');

function connectDB(host, options) {
    mongoose.connect(host, options)
        .then(db => console.log('DB is connected'))
        .catch(err => console.error(err));
}



module.exports.connectDB = connectDB;