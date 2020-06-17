const express = require('express');
const router = express.Router();

// import controller
const {requireSignin } = require('../controllers/auth.controller');
const {getNotificationsController,seenController} = require('../controllers/notification.controller');


//router.get('/request/get/:id', requireSignin, readController);
//router.post('/request/add',requireSignin, addController);
router.get('/notifications',requireSignin, getNotificationsController);
router.post('/notification/seen',requireSignin, seenController);
module.exports = router;