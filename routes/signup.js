const express = require("express");
const User = require("../models/user");
const router = express.Router();

// 회원가입 API
router.post("/", async (req, res) => {
  const { nickname, password, confirm } = req.body;

  if (password !== confirm) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }

  //nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.findOne({ nickname });
  if (existsUsers) {
    res.status(400).send({
      errorMessage: "닉네임이 이미 사용중입니다.",
    });
    return;
  }

  const user = new User({ nickname, password });
  await user.save();

  res.status(201).send({ message: "회원 가입에 성공하였습니다."});
});

module.exports = router;
