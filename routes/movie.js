const express = require('express');

const { uploadImage, uploadVideo } = require('../middleware/multer');
const { actorValidator, validate, validateMovie } = require('../middleware/validator');
const { isAuth, isAdmin } = require('../middleware/auth');
const { uploadTrailer, createMovie, updateMovieWithOutPoster, updateMovieWithPoster, removeMovie, getMovies } = require('../controllers/movie');
const { parseData } = require('../utils/helper');
const router = express.Router()

router.post("/uploadTrailer", 
    isAuth, isAdmin,uploadVideo.single('video'),
    uploadTrailer)
    
router.post("/movieCreate", 
    isAuth, isAdmin, uploadImage.single('poster'),
    parseData,
    validateMovie,
    validate, 
    createMovie)
    
router.patch("/movieUpdate-without-poster/:id", 
    isAuth, isAdmin, 
    //parseData,
    validateMovie,
    validate,
    updateMovieWithOutPoster)
    
router.patch("/movieUpdate-with-poster/:id", 
    isAuth, isAdmin, 
    
    uploadImage.single('poster'),
    parseData,
    validateMovie,
    validate,
    updateMovieWithPoster)
    
router.delete("/:id", 
    isAuth, isAdmin, 
    removeMovie
    )

    router.get("/movies", isAuth, isAdmin, getMovies);
module.exports = router;