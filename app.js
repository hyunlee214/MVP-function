const createError         = require('http-errors');
const express             = require('express');
const path                = require('path');
const cookieParser        = require('cookie-parser');
const logger              = require('morgan');
const models              = require("./models/index.js");


const indexRouter         = require('./routes/index');
const usersRouter         = require('./routes/users');
const multerRouter        = require('./routes/fileUpload');

const app = express();

// view engine setup
app
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

app
  .use(logger('dev'))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(express.static(path.join(__dirname, 'public')))

app
  .use('/', indexRouter)
  .use('/users', usersRouter)

  // multer
  .use('/upload', multerRouter)
  .use('/upload', express.static('uploads'))

// catch 404 and forward to error handler
app
  .use(function(req, res, next) {
  next(createError(404));
});

// error handler
app
  .use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

models.sequelize.sync().then( () => {
    console.log("DB 연결성공");
}).catch(err => {
    console.log("DB 연결실패");
    console.log(err);
})


module.exports = app;
