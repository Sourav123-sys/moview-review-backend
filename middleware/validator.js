const { check, validationResult } = require('express-validator');
const genres = require('../utils/genres');
const { isValidObjectId } = require('mongoose');


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

exports.validateMovie = [

    check('title').trim().notEmpty().withMessage("movie title is missing"),
    check('storyLine').trim().notEmpty().withMessage("storyLine is missing"),
    check('language').trim().notEmpty().withMessage("language is missing"),
    check('type').trim().notEmpty().withMessage("type is missing"),
    check('genres').isArray().withMessage("genres must be an array of strings").custom((value) => {
        for (let g of value) {
            if(!genres.includes(g)) throw  Error ('Invalid genres')
        }
        return true;
    }),
    check('tags').isArray({min:1}).withMessage("Tags must be an array of strings").custom((tags) => {
        for (let tag of tags) {
            if(typeof tag !=='string') throw  Error ('Tags must be an array of strings')
        }
        return true;
    }),
    check('cast').isArray({min:1}).withMessage("cast must be an array of object").custom((cast) => {
        for (let c of cast) {
            if(!isValidObjectId(c.actor)) throw  Error ('Invalid cast id inside cast')
            if(!c.roleAs?.trim()) throw  Error ('Role is missing inside cast')
            if(typeof c.leadActor !== 'boolean') throw  Error ('Only accepted boolean value inside lead actor inside cast') 
        }
        return true;
    }),


    check('status').isIn( ["public", "private"]).withMessage("Movie status must be public or private "),
    check('releaseDate').isDate().withMessage("releaseDate is missing"),

    check("trailer")
    .isObject()
    .withMessage("trailer must be an object with url and public_id")
    .custom(({ url, public_id }) => {
      try {
        const result = new URL(url);
        if (!result.protocol.includes("http"))  throw Error("Trailer url is invalid!");

        const arr = url.split("/");
        const publicId = arr[arr.length - 1].split(".")[0];

        if (public_id !== publicId) throw Error("Trailer public_id is invalid!");
        
          return true;
          
      } catch (error) {
        throw Error("Trailer url is invalid!");
      }
    }),
    // check("poster").custom((_, { req }) => {
    //     if (!req.file) throw Error("Poster file is missing!");
    //     return true;
    //   }),
]