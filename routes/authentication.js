var express = require('express');
var router = express.Router();
var Auth=require('../models/Authentication_model');
var requestIp = require('request-ip');
var jwt = require("jsonwebtoken");
var Auth_service = require('../services/auth.service');

/* GET home page. */
router.get('/',Auth_service.verify_access_token,function(req, res, next) {
  res.render('index', { title: 'Authentication' });
});

router.post('/',(req,res)=>{
    console.log(req.body);    
    const email = req.body.email;

    if(req.body.email=='' || typeof(req.body.email)=='undefined'){
        const result = {
            status : 'false',
            message : 'Please Enter Email'
        };
        res.json(result);
    }else if(req.body.password=='' || typeof(req.body.password)=='undefined'){
        const result = {
            status : 'false',
            message : 'Please Enter password'
        };
        res.json(result);
    }else if(req.headers.verify_token == '' || typeof(req.headers.verify_token)=='undefined'){
        const result = {
            status : 'false',
            message : 'Verify Token Missing'
        };
        res.json(result);
    }else{
        Auth.getUserByEmail(email,function(err,data){
            if(err){
                res.send(err);
            }
            if(!data.length){
                const result = {
                    status : 'false',
                    message : 'Credentials Does Not Match.'
                }
                res.json(result);
            }else{
                
                if(data[0].verify_token == req.headers.verify_token){
                    console.log('hey');
                    
                    if(data[0].password==req.body.password){
                        var token = jwt.sign({
                            password :req.body.password,
                            email : data[0].email
                        },secretkey,(err,token)=>{
                            if(err){
                                res.json({status:'error'});
                            }
                            const result = {
                                status : 'true',
                                message : 'Record Found.',
                                data : {
                                    id :data[0].id,
                                    email : data[0].email,
                                    access_token :token
                                }
                            }
                            res.json(result);
                        })
                    }else{
                        const result = {
                            status : 'false',
                            message : 'Credentials Does Not Match.'
                        }
                        res.json(result);
                    }
                }else{
                    const result = {
                        status : 'false',
                        message : 'Access Token Does Not Match.'
                    }
                    res.json(result);    
                }            
            } 
        });
    }

})

module.exports = router;
