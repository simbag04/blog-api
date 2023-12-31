const Comment = require('../models/Comment')
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.get_all_comments = asyncHandler(async(req, res, next) => {
  const comments = await Comment.find({post: req.params.pid}).populate("created_by");
  return res.status(200).json(JSON.stringify(comments));
})

exports.add_comment = [
  body("content", "Please write a comment")
    .trim()
    .isLength({ min: 1 }),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(200).json({ errors: errors.errors })
    }

    const comment = new Comment({
      content: req.body.content,
      created_by: req.user._id,
      post: req.params.pid
    })

    await comment.save();
    return res.status(200).json({ message: "Comment saved successfully" })
  }

  )
]

exports.get_single_comment = asyncHandler(async(req, res, next) => {
  const comment = await Comment.findById(req.params.cid);

  if (comment == null) {
    return res.status(404).json({ message: "Comment not found" })
  }
  return res.status(200).json({ comment });
})

exports.update_comment_likes = asyncHandler(async(req, res, next) => {
  const comment = await Comment.findById(req.params.cid);

  if (comment == null) {
    return res.status(404).json({ message: "Comment not found" })
  }

  comment.likes = comment.likes + 1;
  await Comment.findByIdAndUpdate(req.params.cid, comment, {});
  return res.status(200).json({message: `new likes: ${comment.likes}`});
})

exports.delete_comment = asyncHandler(async(req, res, next) => {
  await Comment.findByIdAndDelete(req.params.cid);
  return res.status(200).json({ message: "Comment deleted successfully" })
})