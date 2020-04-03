const mongoose = require('mongoose');
const EducationYearSchema = new mongoose.Schema({
    year: {
        type: String,
        unique: true
    },
    isActive: {
        type: Boolean
    },
    tuition: {
        type: Number
    }
});
EducationYearSchema.virtual('enrolls', { 
    ref: 'Enroll', 
    localField: 'year', 
    foreignField: 'thisYear' 
}) 
EducationYearSchema.virtual('teacherCourses', { 
    ref: 'TeacherCourse', 
    localField: '_id', 
    foreignField: 'educationYearID' 
}) 
const EducationYear = mongoose.model('EducationYear', EducationYearSchema);
module.exports = EducationYear;
