const express = require('express');
const router = express.Router();

// import controller
const { requireSignin } = require('../controllers/auth.controller');
const { getAllController,addController } = require('../controllers/request.controller');


//router.get('/request/get/:id', requireSignin, readController);
router.post('/request/add',requireSignin, addController);
router.get('/request/getAll',requireSignin, getAllController);

module.exports = router;