var express = require('express');
var router = express.Router();
const Team = require('../models/team');
const auth = require('../middleware/auth');


router.get('/allTeams', auth, async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  }
  catch (err) {
    res.send('Error: ' + err);
  }
});

/* GET team listing. */
router.get('/', auth, async (req, res) => {
  try {
    const teamName = { name: req.query.team };
    Team.findOne(teamName)
      .then(team => {
        if (!team) return res.status(400).json({ msg: 'You are not part of any team.' });
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
      return res.status(400).json({ msg: 'Field is empty.' });
    }
    Team.findOne({ name: req.body.name })
      .then(async team => {
        if (team) return res.status(400).json({ msg: 'This team already exists.' });
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

module.exports = router;