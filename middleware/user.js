

const { isValidObjectId } = require('mongoose')
const PasswordResetToken = require('../models/passwordResetToken')


exports.isValidPassResetToken =async (req, res, next) => { 

    const { token, userId } = req.body

    if (!token.trim() ||!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid Request' })
    }
    const resetToken = await PasswordResetToken.findOne({ owner: userId })
    if (!resetToken) {
            return res.status(400).json({ message: 'Unauthorized access.Invalid token' })
    }
    const matched = await resetToken.compareToken(token) 
    if (!matched) {
            return res.status(400).json({ message: 'Unauthorized access.Invalid request' })
    }
    req.resetToken = resetToken
next()
}