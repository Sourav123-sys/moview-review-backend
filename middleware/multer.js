const multer = require('multer');

const storage = multer.diskStorage({})

const fileFilter = (req,file,cb) => {
    console.log(file, 'file')
    if (!file.mimetype.startsWith('image')) {
        cb('Supported image files only',false)
    }
    cb(null, true)
}
const videoFilter = (req,file,cb) => {
    console.log(file, 'file')
    if (!file.mimetype.startsWith('video')) {
        cb('Supported video files only',false)
    }
    cb(null, true)
}
   exports.uploadImage=multer({storage,fileFilter});
   exports.uploadVideo=multer({storage,videoFilter});