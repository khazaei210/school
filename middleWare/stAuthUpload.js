const jwt = require('jsonwebtoken') 
const Student = require('../model/student')
const shelljs = require('shelljs');
const path = require('path')
 
const stAuthUpload = async (req, res, next) => { 
    try { 
        const token = req.headers.authorization.replace('Bearer ', '') 
        const decoded = jwt.verify(token, process.env.JWT_SECRET_PHRASE) 
        const student = await Student.findOne({ _id: decoded._id, 'tokens.token': token }) 
        if (!student) { 
        throw new Error();
        }
        let status = shelljs.mkdir('-p', path.join(__dirname,`../public/img/docs/${student.nationalID}`));
        req.student = student
        next() 
    } catch (e) { 
        res.send({login: true})
    } 
}
 
module.exports = stAuthUpload 