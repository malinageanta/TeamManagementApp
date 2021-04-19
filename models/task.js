var mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    priority: {
        type: string,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: string,
        required: true
    },
    assignee: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('Task', taskSchema);