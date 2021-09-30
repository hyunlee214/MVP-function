const express = require('express');
const router = express.Router();
const multer = require('multer');

const stroage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploadFile/')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ stroage: stroage});

// http://localhost:3000/fileUpload/uploadPage
router.get('/uploadPage', (req, res) => {
  res.render('upload');         // ejs파일
})

router.post('/uploadComplete', upload.single('imgFile'), (req, res) => {
  let file = req.file
  let result = {
    originalName : file.originalName,
    size: file.size,
  }
  res.json(result);
})

module.exports = router;