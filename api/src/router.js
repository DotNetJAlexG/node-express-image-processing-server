const {Router} = require('express');
const multer = require('multer');
const path = require('path');

const router = Router();
const photoPath = path.resolve(__dirname, '../../client/photo-viewer.html');

const filename = (request, file, callback) => {
    callback(null, file.originalname);
}

const storage = multer.diskStorage({
    destination: 'api/uploads/', 
    filename,
});

const fileFilter = (request, file, callback) => {
    if (file.mimetype !== 'image/png') {
        request.fileValidationError = 'Wrong file type';
        callback(null, false, new Error('Wrong file type'));
    }
    else {
        callback(null, true);
    }
}

const upload = multer({fileFilter, storage});



router.get('/photo-viewer', (request, response) => {
    response.sendFile(photoPath);
});
router.post('/upload', upload.single('photo'), (request, response) => {
    if ('fileValidationError' in request) {
        return response.status(400).json({error: request.fileValidationError});
    }
    else {
        return response.status(201).json({success: true});
    }
})

module.exports = router;

