const Request = require('../models/request.model');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');

const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');

exports.getAllController = (req, res) => {
    const userId=req.user._id;
    Request.find()
    .then(requests =>{ 
        let arr=[];    
        for(let i=0;i<requests.length;i++)
        {
            if(userId!==requests[i].userId)
                arr.push(requests[i]);
        }
        res.json(arr)})
    .catch(err => res.status(400).json('Error: ' + err));
   
};

exports.addController = (req, res) => {
    
    
        
        const userId = req.user._id;
        const title = req.body.title;
        const description = req.body.description;
        const longitude = req.body.longitude;
        const latitude=req.body.latitude;
        const priority =0;
      
        const newRequest = new Request({
            userId,
            title,
          description,
          longitude,
          latitude,
          priority
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