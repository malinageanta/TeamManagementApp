var express = require('express');
var router = express.Router();
var Team = require('../models/team');

/* GET users listing. */
router.get('/', async(req, res) => {
  try
  {
    var teams = await Team.find();
    res.json(teams);
  }
  catch(err) {
    res.send('Error: ' + err);
  }
});

 router.post('/', async(req, res) => {
  try
  {
    const team = new Team({
      name: req.body.name
    });
    const t = await team.save();
    res.json(t);
  }catch(err){
    res.send('Error: ' + err);
  }
 });

 router.get('/:postId', async(req, res) => {
  try
  {
    var teams = await Team.findById(req.params.postId);
    res.json(teams);
  }
  catch(err) {
    res.send('Error: ' + err);
  }
 });

 router.delete('/:postId', async(req, res) => {
  try
  {
    var teams = await Team.remove({_id: req.params.postId});
    res.json(teams);
  }
  catch(err) {
    res.send('Error: ' + err);
  }
 });

 router.patch('/:postId', async(req, res) => {
  try
  {
    const t = await Team.updateOne(
          {_id: req.params.postId}, 
          {$set : {name: req.body.name}
        });
    res.json(t);
  }catch(err){
    res.send('Error: ' + err);
  }
 });


module.exports = router;
