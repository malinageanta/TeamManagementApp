var express = require('express');
var router = express.Router();
const Task = require('../models/task');
const Team = require('../models/team');
const auth = require('../middleware/auth');


router.get('/', auth, async (req, res) => {
    try {
        if (!req.query.members) {
            return res.status(400).json({ msg: 'Members field is mandatory.' })
        }

        let members = req.query.members.split(',');
        if (!members || !members.length) {
            return res.status(400).json({ msg: 'Unable to parse members list from request.' })
        }

        let task = await Task.find({ 'assignee': { $in: members } })

        if (!task) return res.status(400).json({ msg: 'No task created yet!' });

        return res.json(task);
    }
    catch (err) {
        res.send('Error: ' + err);
    }
});


router.post('/', auth, async (req, res) => {
    try {
        const { name, priority, description, status, assignee, currentTeam } = req.body;
        if (!name || !priority || !status || !assignee) {
            return res.status(400).json({ msg: 'Non optional field empty!' });
        }
        const team = await Team.findOne({ name: currentTeam.name })
        if (!team.members.includes(assignee)) return res.status(400).json({ msg: 'The assignee is not part of your team!' });

        Task.findOne({ name: name })
            .then(async task => {
                if (task) return res.status(400).json({ msg: 'A task with the same name already exists!' });
                const newTask = new Task({
                    name: name,
                    priority: priority,
                    description: description,
                    status: status,
                    assignee: assignee
                });
                const savedNewTask = await newTask.save();
                res.status(202).send();
            });
    }
    catch (err) {
        res.send('Error: ' + err);
    }
});

router.patch('/:id', auth, async (req, res) => {
    try {
        if (!req.body.newItem) {
            return res.status(400).json({ msg: 'No value received!' });
        }
        var updatedTask = null;
        var itemToBeUpdated = req.query.itemToBeUpdated;
        var $set = {};
        $set[itemToBeUpdated] = req.body.newItem;
        updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id },
            { $set: $set },
            { new: true }
        )
        if (updatedTask) {
            res.json(updatedTask);
        }
        else {
            res.status(400).json({ msg: "No team updated!" });
        }
    }
    catch (err) {
        res.send('Error: ' + err);
    }
});

router.delete('/:taskId', auth, async (req, res) => {
    try {
        await Task.remove({ _id: req.params.taskId });
        res.status(202).send();
    }
    catch (error) {
        res.status(500).send();
    }
});

module.exports = router;