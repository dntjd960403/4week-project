const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  nickname: String,
  postId: String,
  doneAt: Date,
});

module.exports = mongoose.model("Like", LikeSchema);