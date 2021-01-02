var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

require('dotenv/config');


/* GET users listing. */
router.get('/', async(req, res) => {
  try
  {
    var users = await User.find();
    res.json(users);
  }
  catch(err) {
    res.send('Error: ' + err);
  }
});

router.post('/', async(req, res) => {
  try
  {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields.' });
    }

    User.findOne({ email })
      .then(user => {
        if(!user) return res.status(400).json({ msg: 'User does not exists.' });

        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
            jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                {expiresIn: 3600},
                (err, token) => {
                if(err) throw err;
                res.json({
                    token,
                    user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                    }
                });
            });
        });
      });

  }catch(err){
    res.send('Error: ' + err);
  }
});

router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user));
});

module.exports = router;
