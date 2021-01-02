var express = require('express');
var router = express.Router();
const Team = require('../models/team');
const auth = require('../middleware/auth');


/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    var teams = await Team.find();
    res.json(teams);
  }
  catch (err) {
    res.send('Error: ' + err);
  }
});

module.exports = router;