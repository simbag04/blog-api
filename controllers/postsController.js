const Post = require('../models/Post');
const Comment = require('../models/Comment')
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
      return res.status(200).json({ success: false, message: errors.errors })
    }

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      created_by: req.user._id,
      published: req.body.published
    })

    await post.save();
    return res.status(200).json({ success: true })

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
  const post = await Post.findById(req.params.pid);
  if (post.created_by.toString() !== req.user._id) {
    return res.status(401).json({ success: false, message: "Unauthorized"})
  } else {
    await Post.findByIdAndDelete(req.params.pid);
    await Comment.deleteMany({ post: req.params.pid });
    return res.status(200).json({ success: true, message: "Post deleted" });
  }

})

exports.update_post = [
  body("title", "Please enter a title")
  .trim()
  .isLength({ min: 1 }),

  body("content", "Please enter your post content")
    .trim()
    .isLength({min: 1}),
  
  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    const post = await Post.findById(req.params.pid);

    if (post.created_by.toString() !== req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized"})
    }

    if (!errors.isEmpty()) {
      return res.status(200).json({ success: false, message: errors.errors })
    }

    if (post == null) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    post.title = req.body.title;
    post.content = req.body.content;
    post.published = req.body.published;
    await Post.findByIdAndUpdate(req.params.pid, post, {});
    return res.status(200).json({ success: true, message: "Succesfully updated post" })
  })
]
