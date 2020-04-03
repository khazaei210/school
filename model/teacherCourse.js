const mongoose = require('mongoose');
const teacherCourseSchema = new mongoose.Schema({
    teacherID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    educationYearID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EducationYear'
    }
},
    {
        timestamps: true
    }
);

const TeacherCourse = mongoose.model('TeacherCourse', teacherCourseSchema);
module.exports = TeacherCourse;
