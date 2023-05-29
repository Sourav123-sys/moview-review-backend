const express = require('express');
const { actorCreate, updateActor, deleteActor, searchActor, latestActors, singleActor, getActors } = require('../controllers/actor');
const { uploadImage } = require('../middleware/multer');
const { actorValidator, validate } = require('../middleware/validator');
const { isAuth, isAdmin } = require('../middleware/auth');
const router = express.Router()


router.post("/actorCreate", uploadImage.single('avatar'),
    isAuth, isAdmin,
    actorValidator, validate, actorCreate)

router.post("/updateActor/:id",
    isAuth, isAdmin,
    uploadImage.single('avatar'), actorValidator, validate, updateActor)

router.delete("/:id",
    isAuth, isAdmin,
    deleteActor)

router.get("/search",isAuth,isAdmin, searchActor)

router.get("/latest-uploads", isAuth, isAdmin, latestActors)

router.get("/actors", isAuth, isAdmin, getActors);

router.get("/single/:id", singleActor)

module.exports = router;

