const mongoose = require('mongoose');
const Candidate = require('../models/candidate'); 


exports.candidate_add = (req,res) => {
    Candidate.find()
    .select("cid name position")
    .exec()
    .then(docs => {
        const response = {
            candidates: docs.map(doc => {
                return [doc.cid,doc.name,doc.position]
            })
        };
                Candidate.find({name:req.body.name,position:req.body.position})
                .exec()
                .then(candidate => {
                    if(candidate.length >= 1){
                    res.render('candidateAdd',{Token:"?Token="+req.query.Token,message: "Candidate Entry exists",data:response});
                    return res.status(409);
                    } else {
                        const candidate = new Candidate({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            position: req.body.position,
                            cid: new Date().getTime(),
                        });
                        
                        candidate.save()
                        .then(result => {
                            response.candidates.push([candidate.cid, candidate.name,candidate.position]);
                            res.render('candidateAdd',{Token:"?Token="+req.query.Token,message: "Candidate Updated",data:response});
                            res.status(201);
                        })
                        .catch(err => {
                            res.render('candidateAdd',{Token:"?Token="+req.query.Token,message: err,data:response});
                            console.log(err);
                            res.status(500);
                        });
                    }
                });
    }) 
    .catch(err =>{
        res.render('candidateAdd',{Token:"?Token="+req.query.Token,message: err,data:response});
        console.log(err);
        res.status(500);
    });
}


exports.candidate_delete1 = (req, res) => {
    Candidate.find()
    .select("cid name position")
    .exec()
    .then(docs => {
        const response = {
            candidates: docs.map(doc => {
                return [doc.cid,doc.name,doc.position]
            })
        };
        const response1 = [];
        response.candidates.forEach(function(doc){
            if(req.body.name === doc[1]){
                response1.push(doc[2]);
            }
        });
           
        res.render("candidateDelete2",{Token:"?Token="+req.query.Token,data:response,entry:[req.body.name,response1]});
        res.status(200);
    }) 
    .catch(err =>{
        res.render('candidateAdd',{Token:"?Token="+req.query.Token,data:response});
        console.log(err);
        res.status(500);
    });

}


exports.candidate_delete2 = (req, res) => {
    Candidate.remove({name:req.body.name,position:req.body.position})
    .exec()
    .then(result => {
        Candidate.find()
        .select("cid name position")
        .exec()
        .then(docs => {
            const response = {
                candidates: docs.map(doc => {
                    return [doc.cid,doc.name,doc.position]
                })
            };
            res.render('candidateDelete1',{Token:"?Token="+req.query.Token,message:{name: req.body.name,position:req.body.position},data:response});
            res.status(200);
        })
    })
    .catch(err => {
        res.render("candidateDelete1",{Token:"?Token="+req.query.Token,message:err,data:response1});
        res.status(500);
    });  

}