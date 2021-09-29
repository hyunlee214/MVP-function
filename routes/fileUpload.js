const express = require('express');
const router = express.Router();
const multer = express('multer');

// http://localhost:3000/fileUpload/uploadPage
router.get('/uploadPage', (req, res) => {
  res.render('upload');         // ejs파일
})

module.exports = router;