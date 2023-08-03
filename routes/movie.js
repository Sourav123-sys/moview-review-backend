const express = require('express');

const { uploadImage, uploadVideo } = require('../middleware/multer');
const { actorValidator, validate, validateMovie, validateTrailer } = require('../middleware/validator');
const { isAuth, isAdmin } = require('../middleware/auth');
const { uploadTrailer, createMovie, updateMovieWithOutPoster, updateMovieWithPoster, removeMovie, getMovies, getMovieForUpdate, updateMovie, searchMovies } = require('../controllers/movie');
const { parseData } = require('../utils/helper');
const router = express.Router()

router.post("/uploadTrailer", 
    isAuth, isAdmin,uploadVideo.single('video'),
    uploadTrailer)
    
router.post("/movieCreate", 
    isAuth, isAdmin, uploadImage.single('poster'),
    parseData,
    validateMovie,
    validateTrailer, 
    validate, 
    createMovie)
    
// router.patch("/movieUpdate-without-poster/:id", 
//     isAuth, isAdmin, 
//     //parseData,
//     validateMovie,
//     validate,
//     updateMovieWithOutPoster)
    
router.patch("/movieUpdate/:id", 
    isAuth, isAdmin, 
    
    uploadImage.single('poster'),
    parseData,
    validateMovie,
    validate,
    updateMovie)
    
router.delete("/:id", 
    isAuth, isAdmin, 
    removeMovie
    )

    router.get("/movies", isAuth, isAdmin, getMovies);
    router.get("/for-update/:movieId", isAuth, isAdmin, getMovieForUpdate);
    router.get("/search", isAuth, isAdmin, searchMovies);
module.exports = router;