const express = require('express');

const { uploadImage } = require('../middleware/multer');
const { actorValidator, validate } = require('../middleware/validator');
const { isAuth, isAdmin } = require('../middleware/auth');
const router = express.Router()



module.exports = router;