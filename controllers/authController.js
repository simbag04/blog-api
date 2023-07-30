const User = require('../models/User');

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const bcrypt = require("bcryptjs");

exports.log_in_post = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      return res.status(200).json({ message: info.message });
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      return res.status(200).json({ message: "Login successful" });
    });
  })(req, res, next);
}

exports.sign_up_post = [
  body("username", "Username cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must be at least 6 characters")
    .trim()
    .isLength({ min: 6 })
    .escape(),


  asyncHandler(async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      } else {
        const errors = validationResult(req);

        const user = new User({
          username: req.body.username,
          password: hashedPassword
        })

        if (errors.isEmpty()) {
          await user.save();
          res.status(200).json({ message: "Sign up successful" });
        } else {
          res.status(200).json({ message: "Sign up unsuccessful" })
        }
      }
    })
  })
]