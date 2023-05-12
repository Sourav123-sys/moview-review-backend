
const { isValidObjectId } = require('mongoose')
const EmailVerificationToken = require('../models/emailVerifaction')
const User = require('../models/user')
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const { generateOTP, generateMailTransport } = require('../utils/mail')
const PasswordResetToken = require('../models/passwordResetToken')
const { generateRandomByte } = require('../utils/helper')
const jwt = require('jsonwebtoken');


exports.create = async (req, res) => {
    const { name, email, password } = req.body
    console.log(name, email, password, 'from create')
    const oldUser = await User.findOne({ email })

    if (oldUser) {
        return res.status(401).send({ error: 'Email already exists' })
    }
    const newUser = new User({ name, email, password })
    await newUser.save()


    let OTP = generateOTP()

    const newEmailVerficationToken = new EmailVerificationToken({ owner: newUser._id, token: OTP })

    await newEmailVerficationToken.save()

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "a03632a059cab7",
            pass: "820a9baec2dcd0"
        }
    });
    transport.sendMail({
        from: "verificationMoviewApp@gmail.com",
        to: newUser.email,
        subject: "Email Verification",
        html: `
                <p>Hello ${newUser.name},</p>
                <h1>Your Verification Code is ${OTP}.</h1>
                <p>Please,verify your email </p>
                `
    })
    res.status(201).json({
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,

        }


    }
    )
    console.log(

        newUser._id,
        newUser.name,
        newUser.email,
        'created',

    )
}



exports.emailVerify = async (req, res) => {
    const { userId, OTP } = req.body
    if (!isValidObjectId) {
        return res.json({ error: "Invalid User" })
    }
    const user = await User.findById(userId)

    if (!user) {
        return res.json({ error: "user not found" })
    }
    if (user.isVerified) {
        return res.json({ error: "user is already verified" })
    }

    const token = await EmailVerificationToken.findOne({ owner: userId })
    if (!token) {
        return res.json({ error: "token not found" })
    }
    const isMatch = await token.compareToken(OTP)
    if (!isMatch) {
        return res.json({ error: "you entered wrong OTP. Please submit orginal OTP" })
    }
    user.isVerified = true
    await user.save()

    await EmailVerificationToken.findOneAndDelete(token._id)


    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "a03632a059cab7",
            pass: "820a9baec2dcd0"
        }
    });
    transport.sendMail({
        from: "verificationMoviewApp@gmail.com",
        to: user.email,
        subject: "welcome Email",

        html: `
           
                <h1>Welcome to our app.</h1>
                
                `
    })
    const jwtToken = jwt.sign({ userId: user._id }, 'duhehfjswhhufegfuhshfufrwuwhfoe')
    res.json({ user: { id: user._id, name: user.name, email: user.email, token: jwtToken, isVerified: user.isVerified }, message: "Email is Verified.you can go to the app now." })
}


exports.resendEmailVerificationToken = async (req, res) => {

    const { userId } = req.body
    const user = await User.findById(userId)
    console.log(user, 'user from resentemail verification token')
    if (!user) {
        return res.json({ error: "user not found" })
    }
    if (user.isVerified) {
        return res.json({ error: "user is already verified" })
    }
    const alreadyHasToken = await EmailVerificationToken.findOne({ owner: userId })
    if (alreadyHasToken) {
        return res.json({ error: "you can req for another OTP after 1 hour" })
    }
    let OTP = generateOTP()
    const newEmailVerficationToken = new EmailVerificationToken({ owner: user._id, token: OTP })

    await newEmailVerficationToken.save()

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "a03632a059cab7",
            pass: "820a9baec2dcd0"
        }
    });
    transport.sendMail({
        from: "verificationMoviewApp@gmail.com",
        to: user.email,
        subject: "Email Verification",

        html: `
                <p>Hello ${user.name},</p>
                <h1>Your Verification Code is ${OTP}.</h1>
                <p>Please,verify your email </p>
                `
    })
    res.status(201).json({
        message: 'OTP has been  successfully send again .please verify your email .',

    })

}


exports.forgetPassword = async (req, res) => {
    const { email } = req.body
    console.log(email, "email from forgetPassword")
    if (!email) {
        return res.json({ error: "email is missing" })
    }
    const user = await User.findOne({ email })
    if (!user) {
        return res.json({ error: "user not found" })
    }

    const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id })
    if (alreadyHasToken) {
        return res.json({ error: "you can req for another OTP after 1 hour" })
    }

    // crypto.randomBytes(30, (err, buff) => {
    //     if (err) {
    //     return res.status(500).json({ error: err })
    //     }
    //     const buffString= buff.toString('hex')
    // })

    const token = await generateRandomByte()
    const newPasswordResetToken = await PasswordResetToken({ owner: user._id, token })

    await newPasswordResetToken.save()

    const resetPasswordUrl = `http://localhost:3000/resetPassword?token=${token}&id=${user._id}`
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "a03632a059cab7",
            pass: "820a9baec2dcd0"
        }
    });
    transport.sendMail({
        from: "security@MoviewApp.com",
        to: user.email,
        subject: "password reset successfully",

        html: `
                <p>Hello ${user.name},</p>
                <p>Here is your reset password link</p>
                <a href='${resetPasswordUrl}'>Change password</a>
              
                `
    })
    res.status(201).json({
        message: 'Reset-Password Link successfully sent in your email.Please change your password.',

    })
}


exports.sendResetPassTokenStatus = (req, res) => {
    res.json({ valid: true })
}

exports.resetPassWord = async (req, res) => {
    const { newPassWord, userId } = req.body
    console.log(newPassWord, userId, 'newPassWord, userId  from reset')
    const user = await User.findById(userId)
    console.log(user, 'user from reset pass')
    const matched = await user.comparePassWord(newPassWord)
    console.log(matched, 'matched from reset pass')
    if (matched) {
        return res.status(200).json({ error: "you entered your old password.Try to give a new password" })
    }
    user.password = newPassWord
    await user.save()

    await PasswordResetToken.findByIdAndDelete(req.resetToken._id)

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "a03632a059cab7",
            pass: "820a9baec2dcd0"
        }
    });
    transport.sendMail({
        from: "security@MoviewApp.com",
        to: user.email,
        subject: "password reset successfully",

        html: `
                <p>Hello ${user.name},</p>
                <h1>You change your password successfully</h1>
              
                `
    })

    res.status(200).json({
        message: 'password reset successfully',

    })
}

exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(email, password, 'signin')
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(200).json({ error: "User doesn't exist." })
        }
        const matched = await user.comparePassWord(password)
        console.log(matched, 'signin')
        if (matched) {
            console.log(matched, 'enter into match try')
            const { _id, name, isVerified } = user

            const jwtToken = jwt.sign({ userId: user._id }, 'duhehfjswhhufegfuhshfufrwuwhfoe')

            res.json({ user: { id: _id, name, email, token: jwtToken, isVerified } })
        } else {
            return res.status(200).json({ error: "you entered wrong password." })
        }


    } catch (error) {
        console.log(error)
        next(error.message)
    }
}