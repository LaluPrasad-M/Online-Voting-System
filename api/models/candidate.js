const mongoose = require('mongoose');

const CandidateSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type : String, required: true},
    party: {type : String, required: true},
    cid: {type : Number, required: true,},
    position: {type : String, required: true},
});

module.exports = mongoose.model('Candidate', CandidateSchema);
