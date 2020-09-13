const multer = require('multer');
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./uploads/trailerVideos')
    },
    filename : function(req,file,cb){
        cb(null, Date.now()+ " - " + file.originalname)
    }
});

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'video/mp4' || file.mimetype === 'video/avi' ||
       file.mimetype === 'video/mkv' || file.mimetype === 'video/3gp' ||
       file.mimetype === 'video/flv' || file.mimetype === 'video/webm'){
        cb(null,true);
    }
    else {
        req.error = "invalid file type";
        cb(null,false)
    }
}

module.exports = multer({
    storage : storage,
    fileFilter : fileFilter
});