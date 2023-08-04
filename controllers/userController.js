const User = require('../models/User');
const Post = require('../models/Post')
const asyncHandler = require("express-async-handler");

exports.get_user_posts = asyncHandler(async(req, res, next) => {
  const posts = await Post.find({created_by: req.params.uid}).exec();
  res.status(200).json(JSON.stringify(posts));
})
