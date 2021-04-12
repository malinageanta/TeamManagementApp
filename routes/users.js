var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

require('dotenv/config');

/* GET users listing. */
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  }
  catch (err) {
    res.send('Error: ' + err);
  }
});

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, team } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields.' });
    }

    User.findOne({ email })
      .then(user => {
        if (user) return res.status(400).json({ msg: 'User already exists.' });
        const newUser = new User({
          firstName,
          lastName,
          email,
          password,
          role,
          team
        });
        // Create salt & hash
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                jwt.sign(
                  { id: user.id },
                  process.env.JWT_SECRET,
                  { expiresIn: 3600 },
                  (err, token) => {
                    if (err) throw err;
                    res.json({
                      token,
                      user: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role,
                        team: user.team
                      }
                    });
                  });
              });
          });
        })
      });
  } catch (err) {
    res.send('Error: ' + err);
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    var updatedUser = null;
    if (req.body?.team) {
      updatedUser = await User.updateOne(
        { _id: req.params.id },
        { $set: { team: req.body.team } }
      )
    }
    else if (req.body?.role) {
      updatedUser = await User.updateOne(
        { _id: req.params.id },
        { $set: { role: req.body.role } }
      )
    }
    if (updatedUser) {
      res.json(updatedUser);
    }
    else {
      res.status(400).json({ msg: "No user updated!" });
    }
  }
  catch (err) {
    res.send('Error: ' + err);
  }
});

module.exports = router;
