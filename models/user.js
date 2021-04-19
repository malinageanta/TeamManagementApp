var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'basic'
    },
    team: {
        type: String,
        default: ''
    },
    photo: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('User', userSchema);