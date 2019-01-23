var express = require('express');
var router = express.Router();
var Auth=require('../models/Authentication_model');
var requestIp = require('request-ip');
var jwt = require("jsonwebtoken")


exports.verify_access_token = function(req,res,next){
    var access_token = req.headers.access_token
    if(typeof access_token !== 'undefined') {
       jwt.verify(access_token,secretkey,{expiresInMinutes: 1},function(err,decoded){
           if(err){
            res.json({status:'forbidden'});
           }else{
               next();
           }
       })
    }else{
        res.json({message:'Something wrong With Token'});
    }
  }