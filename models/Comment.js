const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: { type: String, required: true },
  created_by: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  timestamp: { type: Date, default: Date.now() }
})

module.exports = mongoose.model("Comment", CommentSchema)