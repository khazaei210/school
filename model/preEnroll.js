const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const preEnrollSchema = new mongoose.Schema({
    
    firstName: {
        type: String
    },
    lastName: {
        type: String

    },
    nationalID: {
        type: String
    },
    lastSchool: {
        type: String
    },
    mobileNumber: {
        type: String

    },
    fatherLicense: {
        type: String

    },
    fatherJob: {
        type: String

    },
    motherLicense: {
        type: String

    },
    motherJob: {
        type: String

    },
    level: {
        type: String

    },
    childNum: {
        type: String

    },
    isSacrifice: {
        type: Boolean
        
    },
   lastYearMark: {
        type: String
    },   

    status: {
        type: Number
    }
},
{
    timestamps: true
});


const PreEnroll = mongoose.model('PreEnroll', preEnrollSchema);
module.exports = PreEnroll;