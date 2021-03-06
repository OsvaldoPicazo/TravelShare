require('dotenv').config()

var createError = require('http-errors');
var express = require('express');

var app = express();

// Functional curling style of loading configuration
require('./config/db')
require('./config/global')(app)

const isLoggedIn = require('./middleware/isLoggedIn');

const indexRouter = require('./routes/index');
const authRouter = require("./routes/auth.routes");
const tripRouter = require('./routes/trip.routes');
const expenseRouter = require('./routes/expense.routes');
const profileRouter = require('./routes/profile.routes');

app.use('/', indexRouter);
app.use('/auth', authRouter)
app.use('/private/trips', isLoggedIn, tripRouter);
app.use('/private/expenses', isLoggedIn, expenseRouter);
app.use('/private/profile', isLoggedIn, profileRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

