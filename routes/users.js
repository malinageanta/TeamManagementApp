var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
var mongoose = require('mongoose');


require('dotenv/config');

router.get('/', async (req, res) => {
  try {
    const users = await User.find({ team: req.query.team });
    res.json(users);
  }
  catch (err) {
    res.send('Error: ' + err);
  }
});


router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, team, photo } = req.body;
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
          password
        });
        // Create salt & hash
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                delete user.password;
                jwt.sign(
                  { _id: user._id },
                  process.env.JWT_SECRET,
                  { expiresIn: 3600 },
                  (err, token) => {
                    if (err) throw err;
                    res.json({
                      token,
                      user
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
    if (req.body.newItem === undefined || req.body.newItem === null) {
      return res.status(400).json({ msg: 'No value received!' });
    }
    var updatedUser = null;
    var itemToBeUpdated = req.query.itemToBeUpdated;
    var $set = {};
    $set[itemToBeUpdated] = req.body.newItem;
    updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: $set },
      { new: true }
    )
    delete updatedUser.password;
    if (updatedUser) {
      return res.json(updatedUser);
    }
  }
  catch (err) {
    res.send('Error: ' + err);
  }
});

module.exports = router;
