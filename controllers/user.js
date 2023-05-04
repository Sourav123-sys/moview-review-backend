
const { isValidObjectId } = require('mongoose')
const EmailVerificationToken = require('../models/emailVerifaction')
const User = require('../models/user')
const nodemailer = require("nodemailer")


exports.create = async (req, res) => {
    const { name, email, password } = req.body
    const oldUser = await User.findOne({ email })
   
    if (oldUser) {
        return res.status(401).send({ error: 'Email already exists' })
    }
    const newUser = new User({ name, email, password })
    await newUser.save()
    

    let OTP = ""
    for (let i = 0; i <= 3; i++){
        const randomValue = Math.round(Math.random() * 9)
        OTP += randomValue
    }

    const newEmailVerficationToken = new EmailVerificationToken({ owner: newUser._id, token: OTP })
    
    await newEmailVerficationToken.save()

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "bcd3e16f23ebe5",
          pass: "b9fa941bb8bd8a"
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
        message: 'OTP has been send successfully .please verify your email.',
       
    })
  
}



exports.emailVerify =async (req, res) => { 
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
    const isMatch = await token.compaireToken(OTP)
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
          user: "bcd3e16f23ebe5",
          pass: "b9fa941bb8bd8a"
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
    res.json({ message: "Email is Verified.you can go to the app now." })
}


exports.resendEmailVerificationToken =async  (req, res) => { 


    const { userId } = req.body
    const user = await User.findById(userId)

    if (!user) {
        return res.json({ error: "user not found" })
    }
    if (user.isVerified) {
        return res.json({ error: "user is already verified" })
    }
    const alreadyHasToken = await EmailVerificationToken.findOne({ owner: userId })
    if (alreadyHasToken ) {
        return res.json({ error: "you can req for another OTP after 1 hour" })
    }
    let OTP = ""
    for (let i = 0; i <= 3; i++){
        const randomValue = Math.round(Math.random() * 9)
        OTP += randomValue
    }

    const newEmailVerficationToken = new EmailVerificationToken({ owner: user._id, token: OTP })
    
    await newEmailVerficationToken.save()

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "bcd3e16f23ebe5",
          pass: "b9fa941bb8bd8a"
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