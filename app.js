const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config();
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const path = require("path");

// passportjs
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require('./models/User');

const indexRouter = require('./routes/router');

const app = express();

// Set up mongoose connection
mongoose.set("strictQuery", false);

const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));

passport.use(
  new LocalStrategy(async(username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      };
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user)
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" })
        }
      })
    } catch(err) {
      return done(err);
    };
  })
);
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.get('/', (req, res) => res.send("HELLo"))

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(3000, () => {
  console.log('Server started on port 3000')
})

module.exports = app;