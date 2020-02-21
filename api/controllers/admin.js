const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin'); 
const Candidate = require('../models/candidate'); 



exports.admin_get_details = (req, res, next) => {
    /*const userData= jwt.decode(req.query.Token);
    console.log(userData.email);
    */Admin.find({email:req.params.email})
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
                    photo:'https://kusuma-ovs..herokuapp.com/public/Profiles/'+user[0].photo
                });
            }
    })
    .catch(err =>{
        res.status(500).json({error: err}); 
    });
}


exports.admin_signup = (req, res, next) => {
    Admin.find({email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length >= 1){
            res.render('adminsignup',{message: "Email Exists"});
            console.log("Email exists");
            return res.status(409);
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    res.render('adminsignup',{message:err});
                    return res.status(500);
                } else {
                    const user = new Admin({
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
                        
                        res.render('adminlogin',{email: result.email,message:"User Created"});
                        res.status(201);
                    })
                    .catch(err => {
                        res.render('adminsignup',{message:err});
                        console.log(err);
                        res.status(500);
                    });
                }
            });
            }
    })
}

exports.admin_login =  (req, res, next) => {
    Admin.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length <1){
            res.render('adminlogin',{email: "",message:"Auth Failed"});
            return res.status(401);
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                res.render('adminlogin',{email: "",message:"Auth Failed"});
                return res.status(401);
            }
            if(result){
                console.log(result);
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
                Candidate.find()
                .select("cid name position")
                .exec()
                .then(docs => {
                    const response = {
                        candidates: docs.map(doc => {
                            return [doc.cid,doc.name,doc.position]
                        })
                    };
                    res.render("candidateAdd",{Token:"?Token="+token,message:"",data:response});
                    return res.status(200);
                })
                .catch(err =>{
                    res.render('candidateAdd',{Token:"?Token="+token,message: err,data:response});
                    console.log(err);
                    return res.status(500);
                });
            } else {
                res.render('adminlogin',{email: "",message:"Auth Failed"});
                return res.status(401);
                
            }
        });
    })
    .catch(err => {
        res.render('adminlogin',{email: "",message:err});
        console.log(err);
        res.status(500);
    });
    
}

exports.admin_delete =  (req, res, next) =>{
    Admin.remove({_id: req.params.userId})
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