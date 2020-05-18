const express = require('express');
const router = express.Router();

// import controller
const { requireSignin } = require('../controllers/auth.controller');
const {chatController} = require('../controllers/video.controller');


//router.get('/request/get/:id', requireSignin, readController);
//router.post('/request/add',requireSignin, addController);
router.get('/messages',requireSignin, chatController);

module.exports = router;