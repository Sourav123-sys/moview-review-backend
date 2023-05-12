const multer = require('multer');

const storage = multer.diskStorage({})

const fileFilter = (req,file,cb) => {
    console.log(file, 'file')
    if (!file.mimetype.startsWith('image')) {
        cb('Supported image files only',false)
    }
    cb(null, true)
}
   exports.uploadImage=multer({storage,fileFilter});