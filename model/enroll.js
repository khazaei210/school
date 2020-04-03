const mongoose = require('mongoose');
const EnrollSchema = new mongoose.Schema({
    studentID: {
        type: String,
        ref: 'Student'
    },
    thisYear: {
        type: String,
        ref: 'EducationYear'
    },
    grade: {
        type: String
    }
});

const Enroll = mongoose.model('Enroll', EnrollSchema);
module.exports = Enroll;
