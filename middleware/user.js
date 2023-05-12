

const { isValidObjectId } = require('mongoose')

const PasswordResetToken = require('../models/passwordResetToken')


exports.isValidPassResetToken =async (req, res, next) => { 
    const { token, userId } = req.body
    console.log(token, userId, 'token,userid from isvalidpassresettoken')
    
    if (!token?.trim() ||!isValidObjectId(userId)) {
        return res.status(200).json({ error: 'Invalid Request' })
    }
    const resetToken = await PasswordResetToken.findOne({ owner: userId })
    console.log(resetToken,'reset token isvalidpassresettoken')
    if (!resetToken) {
            return res.status(200).json({ error: 'Unauthorized access.Invalid token' })
    }
    const matched = await resetToken.compareToken(token) 
    console.log(matched,'matched from ')
    if (!matched) {
            return res.status(200).json({ error: 'Unauthorized access.Invalid request' })
    }
    req.resetToken = resetToken
next()
}