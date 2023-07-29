const mongoose = require('mongoose');
const { ObjectId } = require("mongodb");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, maxLength: 100, required: true },
  content: { type: String, required: true },
  created_by: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  timestamp: { type: Date, default: Date.now() },
  published: { type: Boolean, default: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
})

module.exports = mongoose.model("Post", PostSchema);