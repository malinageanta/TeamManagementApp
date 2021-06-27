var express = require('express');
var router = express.Router();
const Task = require('../models/task');
const Team = require('../models/team');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { compare } = require('bcryptjs');


router.get('/usersWithTasks', auth, async (req, res) => {
    try {
        const users = await User.find({ team: req.query.team });

        let tasks = [];
        for (const user of users) {
            userTasks = await Task.find({ assignee: user.email });
            userTasks = userTasks.map((x) => {
                x = x.toObject();
                x.email = x.assignee;
                x.fullName = user.lastName + ' ' + user.firstName;
                x.assignee = { fullName: x.fullName, email: x.email };
                x.photo = user.photo;
                return x;
            });


            tasks = tasks.concat(userTasks)
        }

        res.json(tasks).status(202);
    }
    catch (err) {
        res.send('Error: ' + err);
    }
});


router.post('/', auth, async (req, res) => {
    try {
        const { name, type, priority, description, assignee, currentTeam } = req.body;
        if (!name || !type || !priority || !assignee) {
            return res.status(400).json({ msg: 'Non optional field(s) empty!' });
        }
        const team = await Team.findOne({ name: currentTeam })
        if (!team.members.includes(assignee)) return res.status(400).json({ msg: 'The assignee is not part of your team!' });

        Task.findOne({ name: name })
            .then(async task => {
                if (task) return res.status(400).json({ msg: 'A task with the same name already exists!' });
                const newTask = new Task({
                    name: name,
                    type: type,
                    priority: priority,
                    description: description,
                    assignee: assignee

                });
                await team.activities.push({ name: req.user.email, timestamp: Date.now(), msg: `${req.user.firstName} ${req.user.lastName} created task ${newTask.name}.`, type: "success" });
                await team.save();
                await newTask.save();
                res.status(202).send();
            });
    }
    catch (err) {
        res.send('Error: ' + err);
    }
});

router.patch('/:id', auth, async (req, res) => {
    try {
        const newItem = req.body.newItem;
        if (!newItem) {
            return res.status(400);
        }
        const updatedTask = await Task.findOneAndUpdate(
            { name: newItem.name },
            { $set: { status: newItem.status, priority: newItem.priority, assignee: newItem.email, description: newItem.description } },
            { new: true }
        )
        if (updatedTask) {
            var team = await Team.findOne({ name: req.body.team });
            await team.activities.push({ name: req.user.email, timestamp: Date.now(), msg: `${req.user.firstName} ${req.user.lastName} updated task ${updatedTask.name}.`, type: "warning" });
            await team.save();
            return res.json(updatedTask).status(202);
        }
        return res.status(400);
    }
    catch (err) {
        console.log(err)
    }
})

router.delete('/:taskId', auth, async (req, res) => {
    try {
        var deletedTask = await Task.findOne({ _id: req.params.taskId });
        await Task.remove({ _id: req.params.taskId });

        var team = await Team.findOne({ name: req.body.team });
        await team.activities.push({ name: req.user.email, timestamp: Date.now(), msg: `${req.user.firstName} ${req.user.lastName} deleted task ${deletedTask.name}.`, update: "error" });
        await team.save();
        res.status(202).send();
    }
    catch (error) {
        res.status(400).send();
    }
});



module.exports = router;