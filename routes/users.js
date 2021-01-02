var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

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

//  router.post('/', async(req, res) => {
//   try
//   {
//     const team = new Team({
//       name: req.body.name
//     });
//     const t = await team.save();
//     res.json(t);
//   }catch(err){
//     res.send('Error: ' + err);
//   }
//  });

//  router.get('/:postId', async(req, res) => {
//   try
//   {
//     var teams = await Team.findById(req.params.postId);
//     res.json(teams);
//   }
//   catch(err) {
//     res.send('Error: ' + err);
//   }
//  });

//  router.delete('/:postId', async(req, res) => {
//   try
//   {
//     var teams = await Team.remove({_id: req.params.postId});
//     res.json(teams);
//   }
//   catch(err) {
//     res.send('Error: ' + err);
//   }
//  });

//  router.patch('/:postId', async(req, res) => {
//   try
//   {
//     const t = await Team.updateOne(
//           {_id: req.params.postId}, 
//           {$set : {name: req.body.name}
//         });
//     res.json(t);
//   }catch(err){
//     res.send('Error: ' + err);
//   }
//  });

router.post('/', async(req, res) => {
  try
  {
    const { firstName, lastName, email, password } = req.body;
    if(!firstName || !lastName || !email || !password) {
      return res.status(400).json({msg: 'Please enter all fields.'});
    }

    User.findOne({ email })
      .then(user => {
        if(user) return res.status(400).json({msg: 'User already exists.'});
        const newUser = new User({
          firstName,
          lastName,
          email,
          password
        });

      // Create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => {
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
        })
      });
  }catch(err){
    res.send('Error: ' + err);
  }
});

module.exports = router;
