const express = require("express");
const { Users } = require("../models");
const { Op } = require("sequelize");
const Joi = require("joi");
const router = express.Router();
const bcrypt = require("bcrypt");

const usersSchema = Joi.object({
  nickname: Joi.string().alphanum().min(3).required(),
  password: Joi.string().min(4).required(),
  confirm: Joi.string().required(),
});

// 회원가입 API
router.post("/", async (req, res) => {
  try {
    let { nickname, password, confirm } = await usersSchema.validateAsync(
      req.body
    );

    if (password !== confirm) {
      res.status(401).send({
        errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
      });
      return;
    }

    if (password.includes(nickname)) {
      res.status(400).send({
        errorMessage: "패스워드에 닉네임을 넣을 수 없습니다.",
      });
      return;
    }

    // nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
    const existUsers = await Users.findAll({
      where: {
        [Op.or]: [{ nickname }],
      },
    });
    if (existUsers.length) {
      res.status(409).send({
        errorMessage: "이미 가입된 닉네임이 있습니다.",
      });
      return;
    }
    
    password = await bcrypt.hash(password, 6);
    console.log(password);

    await Users.create({ nickname, password });

    // const user = new User({ nickname, password });
    // await user.save();

    res.status(201).send({ message: "회원 가입에 성공하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

module.exports = router;
