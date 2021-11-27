const mongoose = require("mongoose");

  const { Schema } = mongoose;
  const CommentSchema = new Schema({
    postId: Number,
    commentId: Number,
    name: String,
    comment: String
  });

module.exports = mongoose.model("Comment", CommentSchema);