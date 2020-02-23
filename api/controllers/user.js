const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 




exports.user_get_details = (req, res, next) => {
    /*const userData= jwt.decode(req.query.Token);
    console.log(userData.email);
    */User.find({email:req.params.email})
    .exec()
    .then(user => {
            if(user.length >= 1){
                res.status(200).json({
                    _id: user[0]._id,
                    fname: user[0].fname,
                    lname:user[0].lname,
                    gender:user[0].gender,
                    dob:user[0].dob,
                    email: user[0].email,
                    address:user[0].address,
                    city:user[0].city,
                    state:user[0].state,
                    pincode:user[0].pincode,
                    photo:'https://kusuma-ovs.herokuapp.com/public/Profiles/'+user[0].photo
                });
            }
    })
    .catch(err =>{
        res.status(500).json({error: err}); 
    });
}

exports.user_get_signup = (req,res) => {
    res.render('signup',{message:""});
}

exports.user_post_signup = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length >= 1){
            res.render('signup',{message: "Email Exists"});
            console.log("Email exists");
            return res.status(409).json({
                message: "Email exists"
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    res.render('signup',{message:err});
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        fname: req.body.fname,
                        lname:req.body.lname,
                        gender:req.body.gender,
                        dob:req.body.dob,
                        email: req.body.email,
                        address:req.body.address,
                        city:req.body.city,
                        state:req.body.state,
                        pincode:req.body.pincode,
                        password: hash,
                        photo: req.body.photo
                    });
                    console.log(user);
                    user.save()
                    .then(result => {
                        console.log(result);
                        
                        res.render('login',{email: result.email,message:"User Created"});
                        res.status(201).json({
                            message: "User created"
                        });
                    })
                    .catch(err => {
                        res.render('signup',{message:err});
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
            }
    })
}

exports.user_get_login = (req,res) => {
    res.render('login',{email: "",message: ""});
}

exports.user_post_login = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length <1){
            res.render('login',{email: "",message:"Auth Failed"});
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                res.render('login',{email: "",message:"Auth Failed"});
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            if(result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
                );                
                console.log(token);
                return res.status(200).json({
                    message: "Auth successful",
                    token: token //go to 'jwt.io' to decose token
                });
            }
            res.render('login',{email: "",message:"Auth Failed"});
            res.status(401).json({
                message: "Auth failed"
            });
        });
    })
    .catch(err => {
        res.render('login',{email: "",message:err});
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
}

exports.user_delete =  (req, res, next) =>{
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "User deleted"
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
}