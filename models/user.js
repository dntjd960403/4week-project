const mongoose = require("mongoose");
const express = require("express");

const UserSchema = new mongoose.Schema({
  nickname: String,
  password: String,
  confirm: String
});
UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("User", UserSchema);