var mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
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
        required: true
    },
    assignee: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('Task', taskSchema);