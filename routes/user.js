const express = require('express');

const { create, emailVerify, resendEmailVerificationToken } = require('../controllers/user');
const { userValidator, validate } = require('../middleware/validator');

const router = express.Router()





router.post("/create",userValidator,validate, create)
router.post("/verifyEmail", emailVerify)
router.post("/resendEmailVerificationToken", resendEmailVerificationToken )
 
module.exports = router;