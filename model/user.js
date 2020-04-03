const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    nationalID: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
});
userSchema.pre('save', async function (next) { 
    const user = this;
 
    if (user.isModified('password')) { 
        user.password = await bcrypt.hash(user.password, 8) 
    }
 
    next() 
}) 
userSchema.methods.toJSON = function () { 
    const user = this 
    const userObject = user.toObject()
 
    delete userObject.password 
    delete userObject.tokens
 
    return userObject 
} 
userSchema.statics.findByUser = async (userName, pass) => {
    const user = await User.findOne({userName});
    if(!user) return new Error('can not find user');
    const isMatched = await bcrypt.compare(pass, user.password);
    if(!isMatched) return new Error('can not find user');
    return user;
}
userSchema.statics.findByUserforChangePass = async (userName, pass) => {
    const user = await User.findOne({userName});
    if(!user) return false
    const isMatched = await bcrypt.compare(pass, user.password);
    if(!isMatched) return false
    return true;
}
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id:user.id.toString()}, process.env.JWT_SECRET_PHRASE); // {expiresIn: '10 minutes'}
    user.tokens.push({token});
    await user.save();
    return token;
}
const User = mongoose.model('User', userSchema);
module.exports = User;