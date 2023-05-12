const express = require('express');
const { actorCreate, updateActor, deleteActor, searchActor, latestActors, singleActor } = require('../controllers/actor');
const { uploadImage } = require('../middleware/multer');
const { actorValidator, validate } = require('../middleware/validator');
const router = express.Router()


router.post("/actorCreate",uploadImage.single('avatar'),actorValidator,validate,actorCreate)
router.post("/updateActor/:id",uploadImage.single('avatar'),actorValidator,validate,updateActor )
router.delete("/:id",deleteActor )
router.get("/search",searchActor )
router.get("/latest-uploads",latestActors )
router.get("/single/:id",singleActor )

module.exports = router;

