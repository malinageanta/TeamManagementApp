var express = require('express');
var router = express.Router();
const Invitation = require('../models/invitation');
const auth = require('../middleware/auth');
const { route } = require('./auth');


router.get('/', auth, async (req, res) => {
    try {
        const receiver = { receiver: req.query.receiver };
        Invitation.find({ receiver: receiver.receiver, state: "waiting" })
            .then(invitations => {
                if (!invitations.length) return res.status(400).json({ msg: 'No invitation available.' });
                else return res.json(invitations);
            })
    }
    catch (err) {
        res.send('Error: ' + err);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { sender, receiver } = req.body;
        const newInvitation = new Invitation({
            sender: sender,
            receiver: receiver
        });
        const savedInvitation = await newInvitation.save();
        res.json(savedInvitation);
    }
    catch (err) {
        res.send('Error: ' + err);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const removedInvitation = await Invitation.findOneAndDelete({ _id: req.params.id });
        res.json(removedInvitation);
    }
    catch (err) {
        res.send('Error: ' + err);
    }
});

router.patch('/:id', auth, async (req, res) => {
    try {
        let updatedInvitation = await Invitation.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { state: req.body.state } },
            { returnOriginal: false }
        );
        if (updatedInvitation) {
            res.json(updatedInvitation);
        }
        else {
            res.status(400).json({ msg: "No invitation updated!" });
        }
    }
    catch (err) {
        res.send('Error: ' + err);
    }
});

module.exports = router;