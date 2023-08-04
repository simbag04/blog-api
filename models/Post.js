const mongoose = require('mongoose');
const { ObjectId } = require("mongodb");
const DateTime = require("luxon")

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, maxLength: 100, required: true },
  content: { type: String, required: true },
  created_by: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  timestamp: { type: Date, default: Date.now() },
  published: { type: Boolean, default: true },
  likes: { type: Number, default: 0 }
})

module.exports = mongoose.model("Post", PostSchema);