var express = require('express');
var router = express.Router();
const Team = require('../models/team');
const auth = require('../middleware/auth');


router.get('/', auth, async (req, res) => {
  try {
    if (!req.query.team) return res.status(400).json({ msg: 'Field is empty!' });
    const teamName = { name: req.query.team };
    console.log(teamName);
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

module.exports = router;