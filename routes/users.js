const express     = require('express');
const router      = express.Router();
const models      = require('../models');
const crypto      = require('crypto');
const { ESRCH }   = require('constants');


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

router.get('/', function(req, res, next) {
  res.send('main page');
});


router.get('/login', function(req, res, next) {
  res.render('users/login');
});

router.post('/login', async function(req, res, next) {
  let body = req.body;

  let result = await models.user.findOne({
    where: {
      email: body.userEmail
    }
  });

  let dbPassword = result.dataValues.password;
  let inputPassword = body.password;
  let salt = result.dataValues.salt;
  let hashPassword = crypto.createHash('sha512').update(inputPassword + salt).digest('hex');

  if (dbPassword === hashPassword) {
    console.log('login ok');
    res.redirect('/users');
  }
  else {
    console.log('login faild');
    res.redirect('/users/login');
  }
});

// -------------------------------------------

router.get('/findID', function(req, res, next) {
  res.render('users/findID');
});

router.post('findID', function(req, res, next) {

})

router.get('/findPW', function(req, res, next) {
  res.render('users/findPW');
})

router.post('findPW', function(req, res, next) {

})

module.exports = router;
