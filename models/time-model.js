const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var timeSave = new Schema({
    _id: String,
    time: String
});

const time = mongoose.model('time', timeSave);

module.exports = time;