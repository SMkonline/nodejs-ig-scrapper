const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProfileSchema = new Schema({
    profile: { type: String, required: true },
    data: { type: JSON, required: true },
    timestamp: { type: Number, required: true }
});

module.exports = mongoose.model('Profile', ProfileSchema);