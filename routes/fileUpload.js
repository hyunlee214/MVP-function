const express = require('express');
const router = express.Router();
const multer = require('multer');

const stroage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'upload/')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ stroage: stroage});

// http://localhost:3000/upload/uploadPage
router.get('/uploadPage', (req, res) => {
  res.render('upload');         // ejs파일
})

router.post('/create', upload.single('imgFile'), (req, res) => {
  let file = req.file
  
  let result = {
    originalName : file.originalname,
    size: file.size,
  }
  res.json(result);
})

module.exports = router;