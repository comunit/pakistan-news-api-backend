const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TopStorySchema = new Schema({
    _id: String,
    Data: []
});

const topStorySave = mongoose.model('TopStorySave', TopStorySchema);

module.exports = topStorySave;