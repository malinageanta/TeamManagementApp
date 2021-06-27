var mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        default: "Open"
    },
    assignee: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('Task', taskSchema);