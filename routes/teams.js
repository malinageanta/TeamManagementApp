var express = require('express');
var router = express.Router();
const Team = require('../models/team');
const auth = require('../middleware/auth');
const User = require('../models/user');


router.get('/', auth, async (req, res) => {
  try {
    if (!req.query.team) return res.status(400).json({ msg: 'Field is empty!' });
    const teamName = { name: req.query.team };
    Team.findOne(teamName)
      .then(team => {
        if (!team) return res.status(400).json({ msg: 'This team does not exist!' });
        else return res.json(team);
      })
  }
  catch (err) {
    res.send('Error: ' + err);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ msg: 'Field is empty!' });
    }
    Team.findOne({ name: req.body.name })
      .then(async team => {
        if (team) return res.status(400).json({ msg: 'This team already exists!' });
        const newTeam = new Team({
          name: req.body.name,
          admin: req.body.admin,
          members: req.body.members
        });
        await newTeam.activities.push({ name: req.user.email, timestamp: Date.now(), msg: `${req.user.firstName} ${req.user.lastName} created team ${newTeam.name}.`, type: "success" })
        const savedNewTeam = await newTeam.save();
        res.json(savedNewTeam);
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
    var updatedTeam = null;
    var itemToBeUpdated = req.query.itemToBeUpdated;
    var $set = {};
    $set[itemToBeUpdated] = req.body.newItem;
    updatedTeam = await Team.findOneAndUpdate(
      { _id: req.params.id },
      { $set: $set },
      { new: true }
    )
    if (updatedTeam) {
      res.json(updatedTeam);
    }
    else {
      res.status(400).json({ msg: "No team updated!" });
    }
  }
  catch (err) {
    res.send('Error: ' + err);
  }
});

router.patch('/:teamId/deleteMember', auth, async (req, res) => {
  try {
    var team = await Team.findById(req.params.teamId);
    await team.members.pull(req.body.memberId);

    var removedMember = await User.findOne({ email: req.body.memberId });
    let msg = "";
    if (req.body.memberHasLeft) {
      msg = `${removedMember.firstName} ${removedMember.lastName} has left the team.`;
    }
    else {
      msg = `${req.user.firstName} ${req.user.lastName} removed member ${removedMember.firstName} ${removedMember.lastName}`;
    }
    await team.activities.push({ name: req.user.email, timestamp: Date.now(), msg: msg, type: "error" })

    team.save();
    res.status(202).send();
  }
  catch (error) {
    res.status(500).send();
  }
});

router.patch('/:teamId/addMember', auth, async (req, res) => {
  try {
    const newMember = req.body.memberId;
    if (!newMember) return res.status(400).json({ msg: 'Field is empty!' });
    var team = await Team.findById(req.params.teamId);
    if (team.members.includes(newMember)) return res.status(400).json({ msg: 'This user is already a member in your team!' });

    const user = await User.findOne({ email: newMember })
    if (!user) return res.status(400).json({ msg: 'This user does not exist!' });
    if (user.team) return res.status(400).json({ msg: 'This user is already a member in another team!' });

    await team.members.push(newMember);
    await team.activities.push({ name: req.user.email, timestamp: Date.now(), msg: `${req.user.firstName} ${req.user.lastName} added member ${user.firstName} ${user.lastName}.`, type: "info" })

    team.save();

    await User.findOneAndUpdate(
      { email: newMember },
      { $set: { team: team.name } }
    )

    res.status(202).send();
  }
  catch (error) {
    res.status(500).send();
  }
});

module.exports = router;