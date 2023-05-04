const express = require('express');

const { create, emailVerify } = require('../controllers/user');
const { userValidator, validate } = require('../middleware/validator');

const router = express.Router()





router.post("/create",userValidator,validate, create)
router.post("/verifyEmail", emailVerify)
 
module.exports = router;