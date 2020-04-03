const jwt = require('jsonwebtoken') 
const User = require('../model/user')
 
const auth = async (req, res, next) => { 
    try { 
        const token = req.headers.authorization.replace('Bearer ', '') 
        const decoded = jwt.verify(token, process.env.JWT_SECRET_PHRASE) 
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) 
        
        if (!user) { 
        throw new Error();
        }
        
        req.user = user 
        
        next() 
    } catch (e) { 
        res.send({login: true})
    } 
}
 
module.exports = auth 