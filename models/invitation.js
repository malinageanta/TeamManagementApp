var mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
    sender: {
        type: Object,
        required: true
    },
    receiver: {
        type: Object,
        required: true
    },
    state: {
        type: String,
        required: true,
        default: "waiting"
    }
});

module.exports = mongoose.model('Invitation', invitationSchema);