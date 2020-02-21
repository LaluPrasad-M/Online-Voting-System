const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const Candidate = require('../models/candidate'); 

const AdminController = require("../controllers/admin");
const CandidateController = require("../controllers/candidate");


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './api/public/Profiles/');
    },
    filename: function(req, file, cb){
        cb(null,(new Date()).getTime() + file.originalname);
    }
});
const fileFilter = (req, file, cb) =>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true); //Save the file
    } else {
        cb(null, false); // Reject the file
    }
};
const upload = multer({storage: storage,limits: {
    fileSize: 1024 * 1024 *10 
    },
    fileFilter: fileFilter
});


router.get('/details/:email', AdminController.admin_get_details);


router.get('/signup',(req,res) => {
    res.render('adminsignup',{message:""});
});

router.post('/signup',upload.single('photo'), AdminController.admin_signup);

router.get('/login',(req,res) => {
    res.render('adminlogin',{email: "",message: ""});
});

router.post('/login',AdminController.admin_login);

router.delete('/:userId', checkAuth, AdminController.admin_delete);



router.get('/addCandidate',checkAuth, (req,res) => {

    Candidate.find()
    .select("cid name position party")
    .exec()
    .then(docs => {
        const response = {
            candidates: docs.map(doc => {
                return [doc.cid,doc.name,doc.position,doc.party]
            })
        };
        res.render("candidateAdd",{Token:"?Token="+req.query.Token,message:"",data:response});
    }) 
    .catch(err =>{
        res.render('candidateAdd',{Token:"?Token="+req.query.Token,message: err,data:response});
        console.log(err);
        res.status(500);
    });
});

router.post('/addCandidate', checkAuth, CandidateController.candidate_add);



router.get('/deleteCandidate',checkAuth, (req,res) => {

    Candidate.find()
    .select("cid name position party")
    .exec()
    .then(docs => {
        const response = {
            candidates: docs.map(doc => {
                return [doc.cid,doc.name,doc.position,doc.party]
            })
        };
        res.render("candidateDelete1",{Token:"?Token="+req.query.Token,message:"",data:response});
    }) 
    .catch(err =>{
        res.render('candidateDelete1',{Token:"?Token="+req.query.Token,message: err,data:response});
        res.status(500);
    });
});


router.post('/deleteCandidate', checkAuth, CandidateController.candidate_delete1);


router.get('/deleteCandidate1',checkAuth, (req,res) => {
    Candidate.find({name:req.body.name})
    .select("cid name position party")
    .exec()
    .then(docs => {
        const response = {
            candidates: docs.map(doc => {
                return [doc.cid,doc.name,doc.position,doc.party]
            })
        };
        console.log("\n\n\n"+response);
        res.render("candidateDelete2",{Token:"?Token="+req.query.Token,data:response,entry:[req.body.party,response.candidates]});
    }) 
    .catch(err =>{
        res.render('candidateDelete2',{Token:"?Token="+req.query.Token,data:response,entry:[req.body.party,response.candidates]});
        res.status(500);
    });
});

router.post('/deleteCandidate1', checkAuth, CandidateController.candidate_delete2);


module.exports = router;
