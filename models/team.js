var mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    admin: {
        type: Object,
        required: true
    },
    members: {
        type: [],
        required: true
    },
    activities: {
        type: [],
        default: []
    }
});

module.exports = mongoose.model('Team', teamSchema);