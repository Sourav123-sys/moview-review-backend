const { check, validationResult } = require('express-validator');


exports.userValidator = [
    check('name').trim().notEmpty().withMessage("name is invalid"),
  
    check('email').trim().normalizeEmail().notEmpty().isEmail().withMessage("email is invalid"),
    check('password').trim().notEmpty().withMessage("password is missing").isLength({ min:4,max:8}).withMessage("password must be 4 to 8 characters")
]

exports.validatePassWord = [
   // check('name').trim().notEmpty().withMessage("name is invalid"),
  
  //  check('email').trim().normalizeEmail().notEmpty().isEmail().withMessage("email is invalid"),
    check('newPassWord').trim().notEmpty().withMessage("password is missing").isLength({ min:4,max:8}).withMessage("password must be 4 to 8 characters")
]
exports.signInValidator= [
    
    check('email').trim().normalizeEmail().notEmpty().isEmail().withMessage("Email is invalid"),
    check('password').trim().notEmpty().withMessage("Password is missing")
]

exports.actorValidator= [
    check('name').trim().notEmpty().withMessage("name is missing"),
    check('about').trim().notEmpty().withMessage("About is missing"),
    check('gender').trim().notEmpty().withMessage("Gender  is missing"),
   
]
exports.validate = (req, res, next) => { 
    const error = validationResult(req).array();
    //console.log(error);
//if (!error.isEmpty()) {
//  console.log(error.array());
 // return res.status(400).json({ errors: error.array() });
//}
    if (error.length) {
      return  res.json({ error:error[0].msg})
    }
    next()
}