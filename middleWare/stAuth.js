const jwt = require('jsonwebtoken') 
const Student = require('../model/student')
 
const stAuth = async (req, res, next) => { 
    try { 
        const token = req.headers.authorization.replace('Bearer ', '') 
        const decoded = jwt.verify(token, process.env.JWT_SECRET_PHRASE) 
        const student = await Student.findOne({ _id: decoded._id, 'tokens.token': token }) 
        
        if (!student) { 
        throw new Error();
        }
        
        req.student = student
        
        next() 
    } catch (e) { 
        res.send({login: true})
    } 
}
 
module.exports = stAuth 