const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
    name: {
        type: String
    },
    grade: {
        type: String
    },
    section: [{
        title: {
            type: String
        }
    }]
},
    {
        timestamps: true
    }
);
courseSchema.virtual('questions', { 
    ref: 'Question', 
    localField: '_id', 
    foreignField: 'courseID' 
}) 
courseSchema.virtual('teacherCourses', { 
    ref: 'TeacherCourse', 
    localField: '_id', 
    foreignField: 'courseID' 
}) 
const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
