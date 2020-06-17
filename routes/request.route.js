const express = require('express');
const router = express.Router();

// import controller
const { requireSignin } = require('../controllers/auth.controller');
const { getAllController,addController,addOffer,getMyRequests,getAllTags,doneController} = require('../controllers/request.controller');


//router.get('/request/get/:id', requireSignin, readController);
router.post('/request/add',requireSignin, addController);
router.post('/request/addOffer',requireSignin, addOffer);
router.post('/request/done',requireSignin, doneController);
router.get('/request/getAll',requireSignin, getAllController);
router.get('/request/getMyRequests',requireSignin, getMyRequests);
/* router.get('/request/get/:id',requireSignin, getById); */
router.get('/request/getAllTags',requireSignin, getAllTags);
module.exports = router;