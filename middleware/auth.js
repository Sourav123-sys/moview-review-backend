

const jwt = require('jsonwebtoken');
const User = require('../models/user');
exports.isAuth = async (req, res,next) => {
    const token  = req.headers.authorization
    console.log(token, 'token')
    
    const jwtToken = token.split('Bearer ')[1]

    if (!jwtToken) { 
        return res.status(200).json({ error: 'No token provided.' })
    }
    const decode = jwt.verify(jwtToken, process.env.JWT_SECRET)
    const { userId } = decode
    
    const user = await User.findById(userId)
    console.log(user,'user from is auth')
    if (!user) {
        return res.status(200).json({ error: 'Invalid token.user not found' })
    }
    req.user = user
    next()
}

