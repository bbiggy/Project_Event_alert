const express = require('express');
const router = express.Router();

const { createEvent , listEvent, handleCurrentMonth, updateImage } = require('../controllers/fullcalendar');

/* Multer */
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, 'file-' + Date.now() + '.' +
        file.originalname.split('.')[file.originalname.split('.').length-1])}
})

const upload = multer({ storage: storage }).single('file')


// Endpoint = localhost:5000/api/event
// Method   = POST
// Access   = Public
router.post('/event', createEvent)

// Endpoint = localhost:5000/api/event
// Method   = GET
// Access   = Public
router.get('/event', listEvent)

// Endpoint = localhost:5000/api/current-Month
// Method   = Post
// Access   = Public

router.post('/current-Month', handleCurrentMonth)

// Endpoint = localhost:5000/api/current-Date
// Method   = GET
// Access   = Public

//router.get('/current-Date', handleCurrentDate)

// Endpoint = localhost:5000/api/update-Image
// Method   = POST
// Access   = Public

router.post('/update-Image', upload, updateImage)




module.exports = router;