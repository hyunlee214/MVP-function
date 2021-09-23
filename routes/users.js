const express     = require('express');
const router      = express.Router();
const models      = require('../models');
const crypto      = require('crypto');

router.get('/', function(req, res, next) {
  res.send('main page');
})

router.get('/sign_up', function(req, res, next) {
  res.render("users/signup");
});

router.post('/sign_up', function(req, res, next) {
  let body = req.body;

  let inputPassword = body.password;
  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let hashPassword = crypto.createHash('sha512').update(inputPassword + salt).digest('hex');

  let result = models.user.create({
    name: body.userName,
    email: body.userEmail,
    password: hashPassword,
    salt: salt
  })
  res.redirect('/users/sign_up');
})


router.get('/login', function(req, res, next) {
  res.render('users/login');
});

router.post('/login', function(req, res, next) {
  let body = req.body;

  let inputPassword = body.password;
  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let hashPassword = crypto.createHash('sha512').update(inputPassword + salt).digest('hex');
  let dbPassword = result.dataVaules.password;

  if (dbPassword === hashPassword) {
    res.redirect('/users');
  }
  else {
    res.redirect('/users/login')
  }
})

module.exports = router;
