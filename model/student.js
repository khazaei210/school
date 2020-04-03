const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const studentSchema = new mongoose.Schema({
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
    parentName: {
        type: String

    },
    address: {
        type: String

    },
    yearOfBirth: {
        type: String

    },
    zipCode: {
        type: String

    },
    userName: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    pictureURL: {
        type: String
    },
    passportURL: {
        type: String
    },
    nationalIDURL: {
        type: String
    },
    status: {
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
studentSchema.virtual('enrolls', { 
    ref: 'Enroll', 
    localField: 'nationalID', 
    foreignField: 'studentID' 
})
studentSchema.virtual('payments', { 
    ref: 'Payment', 
    localField: 'nationalID', 
    foreignField: 'studentID' 
}) 
studentSchema.pre('save', async function (next) { 
    const student = this;
 
    if (student.isModified('password')) { 
        student.password = await bcrypt.hash(student.password, 8) 
    }
 
    next() 
}) 
studentSchema.statics.findByUser = async (userName, pass) => {
    const student = await Student.findOne({userName});
    if(!student) return new Error('can not find user');
    const isMatched = await bcrypt.compare(pass, student.password);
    if(!isMatched) return new Error('can not find user');
    return student;
}
studentSchema.statics.findByUserforChangePass = async (userName, pass) => {
    const student = await Student.findOne({userName});
    if(!student) return false
    const isMatched = await bcrypt.compare(pass, student.password);
    if(!isMatched) return false
    return true;
}
studentSchema.methods.generateAuthToken = async function () {
    const student = this;
    const token = jwt.sign({_id:student.id.toString()}, process.env.JWT_SECRET_PHRASE); // {expiresIn: '10 minutes'}
    student.tokens.push({token});
    await student.save();
    return token;
}
studentSchema.methods.toJSON = function () { 
    const user = this 
    const userObject = user.toObject()
 
    delete userObject.password 
    delete userObject.tokens
 
    return userObject 
} 
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;