const mongoose = require('mongoose');
const Candidate = require('../models/candidate'); 


exports.candidate_add = (req,res) => {
    Candidate.find()
    .select("cid name position party")
    .exec()
    .then(docs => {
        const response = {
            candidates: docs.map(doc => {
                return [doc.cid,doc.name,doc.position,doc.party]
            })
        };
                Candidate.find({position:req.body.position,party:req.body.party})
                .exec()
                .then(candidate => {
                    if(candidate.length >= 1){
                    res.render('candidateAdd',{Token:"?Token="+req.query.Token,message: "Position already filled",data:response});
                    return res.status(409);
                    } else {
                        const candidate = new Candidate({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            position: req.body.position,
                            cid: new Date().getTime()%10000000000,
                            party: req.body.party,
                        });
                        
                        candidate.save()
                        .then(result => {
                            response.candidates.push([candidate.cid, candidate.name,candidate.position,candidate.party]);
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
    .select("cid name position party")
    .exec()
    .then(docs => {
        const response = {
            candidates: docs.map(doc => {
                return [doc.cid,doc.name,doc.position,doc.party]
            })
        };
        const response1 = [];
        response.candidates.forEach(function(doc){
            if(req.body.party === doc[3]){
                response1.push(doc[2]);
            }
        });
           
        res.render("candidateDelete2",{Token:"?Token="+req.query.Token,data:response,entry:[req.body.party,response1]});
        res.status(200);
    }) 
    .catch(err =>{
        res.render('candidateAdd',{Token:"?Token="+req.query.Token,data:response});
        console.log(err);
        res.status(500);
    });

}


exports.candidate_delete2 = (req, res) => {
    Candidate.remove({position:req.body.position,party:req.body.party})
    .exec()
    .then(result => {
        Candidate.find()
        .select("cid name position party")
        .exec()
        .then(docs => {
            const response = {
                candidates: docs.map(doc => {
                    return [doc.cid,doc.name,doc.position,doc.party]
                })
            };
            res.render('candidateDelete1',{Token:"?Token="+req.query.Token,message:{position:req.body.position, party:req.body.party}, data:response});
            res.status(200);
        })
    })
    .catch(err => {
        res.render("candidateDelete1",{Token:"?Token="+req.query.Token,message:err,data:response1});
        res.status(500);
    });  

}