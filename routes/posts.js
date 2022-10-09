const express = require("express");
const Post = require("../models/post");
const Like = require("../models/like");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

// 모든 게시글 보기
router.get("/", async (req, res) => {
  try {
    let posts = await Post.find().sort({ createdAt: -1 });
    let resultList = [];

    for (const post of posts) {
      resultList.push({
        postId: post._id,
        userId: post.userId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      });
    }

    res.status(200).json({ data: resultList });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

//게시글 상세 조회
router.get("/:_postId", async (req, res) => {
  try {
    const postId = req.params._postId;

    if (!postId) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    const post = await Post.findOne({ postId });

    const result = {
      postId: post._id,
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
    await Post.create({ userId, nickname, title, content, likenum });

    res.status(201).json({ message: "게시글을 생성하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

//게시글 수정
router.put("/:_postId", authMiddleware, async (req, res) => {
  try {
    const { nickname } = res.locals.user;
    const _id = req.params._postId;
    const { title, content } = req.body;

    if (!_id || !title || !content) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    const isExist = await Post.findOne({ _id, nickname });
    if (!isExist) {
      res.status(404).json({ message: "게시글 수정에 실패하였습니다." });
      return;
    }

    await Post.updateOne({ _id }, { $set: { title, content } });

    res.status(201).json({ message: "게시글을 수정하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

// 게시글 삭제
router.delete("/:_postId", authMiddleware, async (req, res) => {
  try {
    const _id = req.params._postId;
    const { nickname } = res.locals.user;

    if (!nickname) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    const isExist = await Post.findOne({ _id, nickname });

    if (!isExist || !_id) {
      res.status(404).json({ message: "게시글 삭제에 실패하였습니다." });
      return;
    }

    await Post.deleteOne({ _id });
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
    let result = "";
    const likey = await Like.findOne({ postId, nickname });

    if (!likey) {
      await Like.create({ nickname, postId });
    } else if (done !== undefined) {
      likey.doneAt = done ? new Date() : null;
      await likey.save();
    }

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
  const like = await Like.find({ postId });
  let likes = [];

  // like null 아닌 것만 뽑아오기  몽구스에서 null 값이 아닌 것만 뽑아오는 방법은? 일단 하자
  for (const liked of like) {
    if (liked.doneAt) {
      likes.push(liked);
    }
  }
  const likenum = likes.length;
  console.log(likes.length);
  await Post.updateOne({ _id: postId }, { $set: { likenum } });
});

router.get("/like", authMiddleware, async (req, res) => {
  const { nickname } = res.locals.user;
  const like = await Like.find(nickname);
  let likes = [];

  for (const liked of like) {
    if (liked.doneAt) {
      likes.push({ liked });
    }
  }

  res.json({ data: likes });
});

module.exports = router;
