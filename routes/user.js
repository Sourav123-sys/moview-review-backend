const express = require('express');

const { create,
    emailVerify,
    resendEmailVerificationToken,
    forgetPassword,
    sendResetPassTokenStatus, 
    resetPassWord,
    signIn} = require('../controllers/user');

const { userValidator, validate, validatePassWord, signInValidator } = require('../middleware/validator');

const { isValidPassResetToken } = require('../middleware/user');
const User = require('../models/user');
const { isAuth } = require('../middleware/auth');

const router = express.Router()


router.post("/create",userValidator,validate, create)
router.post("/signin",signInValidator,validate, signIn)

router.post("/verifyEmail", emailVerify)
router.post("/resend-email-verificationToken", resendEmailVerificationToken )
router.post("/forgot-passWord", forgetPassword )
router.post("/verify-pass-reset-token", isValidPassResetToken,sendResetPassTokenStatus)
router.post("/reset-pass",validatePassWord, isValidPassResetToken,resetPassWord)
 

router.get("/is-auth", isAuth, (req, res) => {
    const {user} = req
    res.json({
        user: {
            id: user._id, name:user.name, email:user.email, }
    })
})
module.exports = router;

