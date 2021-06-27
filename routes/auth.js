var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

require('dotenv/config');


router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields.' });
    }

    User.findOne({ email })
      .then(user => {
        if (!user) return res.status(400).json({ msg: 'User does not exists.' });

        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
            delete user.password;
            jwt.sign(
              { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
              process.env.JWT_SECRET,
              { expiresIn: 6000 },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user
                });
              });
          });
      });

  } catch (err) {
    res.send('Error: ' + err);
  }
});

router.get('/user', auth, (req, res) => {
  User.findById(req.user._id)
    .select('-password')
    .then(user => {
      return res.json(user);
    });


});

module.exports = router;
