var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
var mongoose = require('mongoose');


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
                        team: user.team,
                        photo: user.photo
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
    var itemToBeUpdated = req.query.itemToBeUpdated;
    var $set = {};
    $set[itemToBeUpdated] = req.body.newItem;
    // if (mongoose.Types.ObjectId(req.params.id)) {
    updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: $set },
      { new: true }
    )
    if (updatedUser) {
      res.json(updatedUser);
    }
    else {
      res.status(400).json({ msg: "No user updated!" });
    }
  }
  // else {
  //   res.status(400).json({ msg: "User ID undefined" });
  // }
  // }
  catch (err) {
    res.send('Error: ' + err);
  }
});

module.exports = router;
