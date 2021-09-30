const express = require('express');
const { route } = require('.');
const router = express.Router();
const multer = express('multer');

let stroage = multer.diskStorage({
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
  }
  res.json(result);
})

module.exports = router;