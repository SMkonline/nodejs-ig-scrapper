const mongoose = require('mongoose');
const { Schema } = mongoose;

const HashtagSchema = new Schema({
    hashtag: { type: String, required: true },
    data: { type: JSON, required: true },
    timestamp: { type: Number, required: true }
});

module.exports = mongoose.model('Hashtag', HashtagSchema);