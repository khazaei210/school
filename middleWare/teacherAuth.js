const jwt = require('jsonwebtoken') 
const Teacher = require('../model/teacher')
 
const teacherAuth = async (req, res, next) => { 
    try { 
        const token = req.headers.authorization.replace('Bearer ', '') 
        const decoded = jwt.verify(token, process.env.JWT_SECRET_PHRASE) 
        const teacher = await Teacher.findOne({ _id: decoded._id, 'tokens.token': token }) 
        if (!teacher) { 
        throw new Error();
        }
        
        req.teacher = teacher
        
        next() 
    } catch (e) { 
        res.send({login: true})
    } 
}
 
module.exports = teacherAuth 