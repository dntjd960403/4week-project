const express = require("express");
const {Comments} = require("../models");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

//댓글 목록 조회
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params

    if (!postId) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    const comments = await Comments.findAll({ where: {postId} })

    let resultList = [];

    for (const comment of comments) {
      resultList.push({
        commentId: comment.commentId,
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
router.post("/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params
    const { nickname, userId } = res.locals.user;
    const comment = req.body["comment"];

    if (!comment) {
      res.status(400).json({ message: "댓글 내용을 입력해주세요." });
      return;
    }

    if (!postId) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    await Comments.create({ userId, nickname, postId, comment });

    res.status(201).json({ message: "댓글을 생성하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

// 댓글 수정
router.put("/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params
    const { nickname } = res.locals.user;
    const { comment } = req.body

    if (!comment) {
      res.status(400).json({ message: "댓글 내용을 입력해주세요." });
      return;
    }

    if (!commentId) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    const isExist = await Comments.findOne({ where: {commentId, nickname} });
    if (!isExist) {
      res.status(404).json({ message: "댓글 수정에 실패하였습니다." });
      return;
    }

    await Comments.update({ comment }, { where: { commentId } });

    res.status(201).json({ message: "댓글을 수정하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

// 댓글 삭제
router.delete("/:commentId", authMiddleware, async (req, res) => {
  try {
    const { nickname } = res.locals.user;
    const { commentId } = req.params
    

    if (!commentId ) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    const isExist = await Comments.findOne({ where: {commentId, nickname} });

    if (!isExist || !commentId) {
      res.status(404).json({ message: "댓글 삭제에 실패하였습니다." });
      return;
    }

    await Comments.destroy({ where: {commentId} });
    res.status(201).json({ message: "댓글을 삭제하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

module.exports = router;
