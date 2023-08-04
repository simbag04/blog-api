const Post = require('../models/Post');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require('passport');

exports.get_all_posts = asyncHandler(async(req, res, next) => {
  const posts = await Post.find().populate("created_by").exec();
  res.status(200).json(JSON.stringify(posts));
})

exports.add_post = [
  body("title", "Please enter a title")
    .trim()
    .isLength({ min: 1 }),

  body("content", "Please enter your post content")
    .trim()
    .isLength({min: 1}),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(200).json({ errors: errors.errors })
    }

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      created_by: req.user._id
    })

    await post.save();
    return res.status(200).json({ message: "Succesful" })

  })
]

exports.get_single_post = asyncHandler(async(req, res, next) => {
  const post = await Post.findById(req.params.pid);

  if (post == null) {
    return res.status(404).json({ message: "Post not found" });
  } else {
    return res.status(200).json({ post });
  }
})

exports.delete_post = asyncHandler(async(req, res, next) => {
  await Post.findByIdAndDelete(req.params.pid);
  return res.status(200).json({ message: "Post deleted" });
})

exports.update_post_likes = asyncHandler(async(req, res, next) => {
  const post = await Post.findById(req.params.pid);

  if (post == null) {
    return res.status(404).json({ message: "Post not found" });
  }
  post.likes = post.likes + 1;
  await Post.findByIdAndUpdate(req.params.pid, post, {});
  return res.status(200).json({ message: "Succesfully liked post" })
})

exports.update_post_publish_status = asyncHandler(async(req, res, next) => {
  const post = await Post.findById(req.params.pid);

  if (post == null) {
    return res.status(404).json({ message: "Post not found" });
  }
  post.published = !post.published;
  await Post.findByIdAndUpdate(req.params.pid, post, {});
  return res.status(200).json({ message: "Succesfully changed publish status" })
})

