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

const router = express.Router()


router.post("/create",userValidator,validate, create)
router.post("/signin",signInValidator,validate, signIn)
router.post("/verifyEmail", emailVerify)
router.post("/resend-email-verificationToken", resendEmailVerificationToken )
router.post("/forgot-passWord", forgetPassword )
router.post("/verify-pass-reset-token", isValidPassResetToken,sendResetPassTokenStatus)
router.post("/reset-pass",validatePassWord, isValidPassResetToken,resetPassWord)
 
module.exports = router;