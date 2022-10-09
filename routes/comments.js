const express = require("express");
const Comment = require("../models/comment");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

//댓글 목록 조회
router.get("/:_postId", async (req, res) => {
  try {
    const _id = req.params._postId;

    if (!_id) {
      // TODO: Joi를 사용하지 않음
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    const comments = await Comment.find({ postId: _id }).sort({createdAt: -1});

    let resultList = [];

    for (const comment of comments) {
      resultList.push({
        commentId: comment._id,
        userId: comment.userId,
        nickname: comment.nickname,
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
      });
    }
    res.status(200).json({ data: resultList });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

//댓글 생성
router.post("/:_postId", authMiddleware, async (req, res) => {
  try {
    const _id = req.params._postId;
    const { nickname, userId } = res.locals.user;
    const comment = req.body["comment"];

    if (!comment) {
      res.status(400).json({ message: "댓글 내용을 입력해주세요." });
      return;
    }

    if (!_id) {
      // TODO: Joi를 사용하지 않음
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    await Comment.create({ userId, nickname, postId: _id, comment });

    res.status(201).json({ message: "댓글을 생성하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

// 댓글 수정
router.put("/:_commentId", authMiddleware, async (req, res) => {
  try {
    const _id = req.params._commentId;
    const { nickname } = res.locals.user;
    const { comment } = req.body

    if (!comment) {
      // TODO: Joi를 사용하지 않음
      res.status(400).json({ message: "댓글 내용을 입력해주세요." });
      return;
    }

    if (!_id) {
      // TODO: Joi를 사용하지 않음
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    const isExist = await Comment.findOne({ _id, nickname });
    if (!isExist) {
      res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
      return;
    }

    await Comment.updateOne({ _id }, { $set: { comment } });

    res.status(201).json({ message: "댓글을 수정하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

// 댓글 삭제
router.delete("/:_commentId", authMiddleware, async (req, res) => {
  try {
    const { nickname } = res.locals.user;
    const _id = req.params._commentId;
    const password = req.body["password"];

    if (!_id ) {
      // TODO: Joi를 사용하지 않음
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    const isExist = await Comment.findOne({ _id, nickname });

    if (!isExist || !_id) {
      res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
      return;
    }

    await Comment.deleteOne({ _id });
    res.status(201).json({ message: "댓글을 삭제하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

module.exports = router;
