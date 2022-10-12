const express = require("express");
const { Posts } = require("../models");
const { Likes } = require("../models");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

//개시글 생성
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { nickname, userId } = res.locals.user;
    const { title, content } = req.body;
    if (!title || !content) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }
    const likenum = 0;
    await Posts.create({ userId, nickname, title, content, likenum });

    res.status(201).json({ message: "게시글을 생성하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

// 모든 게시글 보기
router.get("/", async (req, res) => {
  try {
    let posts = await Posts.findAll({ order: [["likenum", "desc"]], });
    let resultList = [];

    for (const post of posts) {
      resultList.push({
        postId: post.postId,
        userId: post.userId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likes: post.likenum,
      });
    }

    res.status(200).json({ data: resultList });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

//좋아요 목록 보기
router.get("/like", authMiddleware, async (req, res) => {
  const { nickname } = res.locals.user;
  const like = await Likes.findAll({ where: { nickname } });
  let likes = [];

  for (const liked of like) {
    if (liked.doneAt) {
      likes.push({ liked });
    }
  }

  res.json({ data: like });
});

//게시글 상세 조회
router.get("/:postId", async (req, res) => { // params url 무조건 아래 (와일드 카드)
  try {
    const postId = req.params.postId;

    const post = await Posts.findOne({ where: { postId } });

    if (!post) {
      res.status(400).json({ message: "게시물 없슈" });
      return;
    }
    const result = {
      postId: post.postId,
      userId: post.userId,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likes: post.likenum,
    };

    res.status(200).json({ data: result });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

//게시글 수정
router.put("/:postId", authMiddleware, async (req, res) => {
  try {
    const { nickname } = res.locals.user;
    const { postId } = req.params;
    const { title, content } = req.body;

    if (!postId || !title || !content) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    const isExist = await Posts.findOne({ where: { postId, nickname } });
    if (!isExist) {
      res.status(404).json({ message: "게시글 수정에 실패하였습니다." });
      return;
    }

    await Posts.update({ title, content }, { where: { postId } });

    res.status(201).json({ message: "게시글을 수정하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

// 게시글 삭제
router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { nickname } = res.locals.user;

    if (!nickname) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    const isExist = await Posts.findOne({ where: { postId, nickname } });

    if (!isExist || !postId) {
      res.status(404).json({ message: "게시글 삭제에 실패하였습니다." });
      return;
    }

    await Posts.destroy({ where: { postId } });
    res.status(201).json({ message: "게시글을 삭제하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

//게시글 좋아요
router.put("/:postId/like", authMiddleware, async (req, res) => {
  const { nickname } = res.locals.user;
  const { done } = req.body;
  const { postId } = req.params;
  try {
    await Likes.create({ postId, nickname, doneAt: 0 });
  } catch (err) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
  try {
    let result = "";
    const likey = await Likes.findOne({ where: { postId, nickname } });
    if (!likey) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }
    if (done) {
      likey.doneAt = new Date();
    } else {
      likey.doneAt = null;
    }
    await likey.save();

    if (!done) {
      result = "게시물의 좋아요를 취소하였습니다.";
    } else {
      result = "게시물의 좋아요를 등록하였습니다.";
    }

    res.send({ message: result });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
  const like = await Likes.findAll({ where: { postId } });
  let likes = [];
  // like null 아닌 것만 뽑아오기  몽구스에서 null 값이 아닌 것만 뽑아오는 방법은? 일단 하자
  for (const liked of like) {
    if (liked.doneAt) {
      likes.push(liked);
    }
  }
  const likenum = likes.length;
  await Posts.update({ likenum }, { where: { postId } });
});

module.exports = router;
