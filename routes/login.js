const express = require("express");
const { Users } = require("../models");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  let { nickname, password } = req.body;

  const user = await Users.findOne({ where: { nickname } });

  const match = bcrypt.compareSync(password, user.password);

  if (match) {
    //login
    res.send({
      token: jwt.sign({ userId: user.userId }, "customized-secret-key"),
    });
  } else {
    res.status(401).send({
      errorMessage: "닉네임 또는 패스워드가 틀렸습니다.",
    });
    return;
  }
});

module.exports = router;
