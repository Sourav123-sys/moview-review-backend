const express = require('express');

const { create, emailVerify, resendEmailVerificationToken, forgetPassword } = require('../controllers/user');
const { userValidator, validate } = require('../middleware/validator');

const router = express.Router()





router.post("/create",userValidator,validate, create)
router.post("/verifyEmail", emailVerify)
router.post("/resendEmailVerificationToken", resendEmailVerificationToken )
router.post("/forgotPassWord", forgetPassword )
 
module.exports = router;