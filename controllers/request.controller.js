const Request = require('../models/request.model');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
var ObjectId = require('mongodb').ObjectID;
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');

exports.getAllController = (req, res) => {
    const userId = req.user._id;
    Request.find()
        .then(requests => {
            let arr = [];
            for (let i = 0; i < requests.length; i++) {
                if (userId !== requests[i].userId)
                    arr.push(requests[i]);
            }
            res.json(arr)
        })
        .catch(err => res.status(400).json('Error: ' + err));

};
exports.getAllTags = (req, res) => {
    const userId = req.user._id;
    Request.find()
        .then(requests => {
            let arr = [];
            
            for (let i = 0; i < requests.length; i++) {
              
                if (requests[i].tags.length > 0) {
                    for(let j=0;j<requests[i].tags.length;j++)
                    {
                        
                    if(!arr.includes(requests[i].tags[j]))
                    arr.push(requests[i].tags[j])
                    }
                }
            }
            res.json(arr)
        })
        .catch(err => res.status(400).json('Error: ' + err));

};
/* exports.getById = (req, res) => {
   
    const requestId= new ObjectId(req.url.substring(14));
    console.log(req.parameters)
    Request.findById('5eb1f674028bad238f37185d')
    .then(request =>{ 
        console.log(request);
        res.json(request)})
    .catch(err => res.status(400).json('Error: ' + err));
   
}; */
exports.addController = (req, res) => {



    const userId = req.user._id;
    const title = req.body.title;
    const description = req.body.description;
    const longitude = req.body.longitude;
    const latitude = req.body.latitude;
    const priority = req.body.priority;
    const tags = req.body.tags;
    const category = req.body.category;
    const images = req.body.images;
    /*  const users=req.body.users; */
    const newRequest = new Request({
        userId,
        title,
        description,
        longitude,
        latitude,
        tags,
        priority,
        category,
        images
    });
    newRequest.save((err, newRequest) => {
        if (err) {
            console.log('REQUEST ADD ERROR', err);
            return res.status(400).json({
                error: 'Request add failed'
            });
        }

        res.json(newRequest);
    });
};
exports.doneController = (req, res) => {

    const doneBy = req.body.doneBy;
    const id = req.body.id;
    console.log(id);
    console.log(doneBy,'user id')

    Request.update({ '_id': ObjectId(id) }, { $set: { doneBy: doneBy } }, function (err, result) {
        if (err) {
            console.log('REQUEST ADD ERROR', err);
            return res.status(400).json({
                error: 'Request add failed'
            });
        }
        res.json(true);
    })
  
};
exports.addOffer = (req, res) => {

    const userss = req.body.users;
    const id = req.body.id;
    console.log(userss)

    Request.update({ '_id': ObjectId(id) }, { $set: { users: userss } }, function (err, result) {
        console.log(result);
    })
    /*  Request.findById('5ed6503027af5a1bc6dc706a')
         .then(requests => {
             requests.users=userss;
             Request.update({_id:"5ed6503027af5a1bc6dc706a"}, {users:userss});
             
         })
         .catch(err => res.status(400).json('Error: ' + err)); */

};

exports.getMyRequests = (req, res) => {
    const userId = req.user._id;
    Request.find({ 'userId': userId })
        .then(requests => {

            res.json(requests)
        })
        .catch(err => res.status(400).json('Error: ' + err));

};