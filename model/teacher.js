const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const teacherSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    nationalID: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    userName: {
        type: String
    },
    password: {
        type: String
    },
    profileImageUrl: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
},
    {
        timestamps: true
    }
);
teacherSchema.virtual('questions', { 
    ref: 'Question', 
    localField: '_id', 
    foreignField: 'teacherID' 
})
teacherSchema.virtual('teacherCourses', { 
    ref: 'TeacherCourse', 
    localField: '_id', 
    foreignField: 'teacherID' 
}) 
teacherSchema.pre('save', async function (next) { 
    const teacher = this;
 
    if (teacher.isModified('password')) { 
        teacher.password = await bcrypt.hash(teacher.password, 8) 
    }
 
    next() 
}) 
teacherSchema.statics.findByUser = async (userName, pass) => {
    const teacher = await Teacher.findOne({userName});
    if(!teacher) return new Error('can not find teacher');
    const isMatched = await bcrypt.compare(pass, teacher.password);
    if(!isMatched) return new Error('can not find teacher');
    return teacher;
}
teacherSchema.statics.findByUserforChangePass = async (userName, pass) => {
    const teacher = await Teacher.findOne({userName});
    if(!teacher) return false
    const isMatched = await bcrypt.compare(pass, teacher.password);
    if(!isMatched) return false
    return true;
}
teacherSchema.methods.generateAuthToken = async function () {
    const teacher = this;
    const token = jwt.sign({_id:teacher.id.toString()}, process.env.JWT_SECRET_PHRASE); // {expiresIn: '10 minutes'}

    teacher.tokens.push({token});
    await teacher.save();
    return token;
}
teacherSchema.methods.toJSON = function () { 
    const user = this 
    const userObject = user.toObject()
 
    delete userObject.password 
    delete userObject.tokens
 
    return userObject 
} 
const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;
