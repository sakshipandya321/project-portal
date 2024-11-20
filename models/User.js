const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['alumni', 'student'], required: true }
});
module.exports = mongoose.model('User', UserSchema);
