const Notification = require('../models/notification.model');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
var ObjectId = require('mongodb').ObjectID;
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');

exports.getNotificationsController = (req, res) => {
    const userId = req.user._id;
    Notification.find({ 'receiver': userId })
        .then(notifications => {

            res.json(notifications)
        })
        .catch(err => res.status(400).json('Error: ' + err));

};

exports.seenController = (req, res) => {

    const doneBy = req.body.doneBy;
    const id = req.body.id;

    Notification.update({ '_id': ObjectId(id) }, { $set: { seen: 1 } }, function (err, result) {
    })
  
};