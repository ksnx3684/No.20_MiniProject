const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts.controller");
const authMiddleware = require("../middlewares/auth-middleware");

const postsController = new PostsController();

// 메인 페이지 조회
// router.get("/posts/main", postsController.getMainPage);

// 마이(특정 유저) 페이지 조회
// router.get("/posts/:_nickname", postsController.getUserPosts);

// 게시글 작성
// router.post("/posts/:_nickname", authMiddleware, postsController.createPost);

// 게시글 상세 조회
router.get("/posts/:_nickname/:_postId", postsController.getOnePost);

// 게시글 수정
router.put("/posts/:_nickname/:_postId", authMiddleware, postsController.updatePost);

// 게시글 삭제
router.delete("/posts/:_nickname/:_postId", authMiddleware, postsController.deletePost);

module.exports = router;
