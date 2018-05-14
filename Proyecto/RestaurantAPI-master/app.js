var debug = require('debug')('restaurantapi:app');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');

var index = require('./routes/index');
var auth = require('./routes/auth');
var materiasPrimas = require('./routes/materiasPrimas');
var recetas = require('./routes/recetas');
var users = require('./routes/users');
var queries = require('./routes/queries');

var app = express();
var config = require('./config');

let baseUrl = config.urlBase;

debug("baseUrl",baseUrl);

var passport = require("passport");

require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(baseUrl+'/', index);
app.use(baseUrl+'/', auth);
app.use(baseUrl+'/materias-primas', materiasPrimas);
app.use(baseUrl+'/recetas',recetas);
app.use(baseUrl+'/users', users);
app.use(baseUrl+'/', queries);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.json({success:false, message:err.message});
});

module.exports = app;
