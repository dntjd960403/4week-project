const express = require("express");
const Signup = require("./signup");
const Login = require("./login");
const Posts = require("./posts");
const Comments = require("./comments");

const router = express.Router();

router.use('/signup', Signup);
router.use('/login', Login);
router.use('/posts', Posts);
router.use('/comments', Comments);

module.exports = router;