const express = require("express");
const router = express.Router({ mergeParams: true });

const authMiddleware = require("../middlewares/auth-middleware");
const CommentsController = require("../controllers/comments.controller");

const commentsController = new CommentsController();

router.get("/", commentsController.allComments);
// 댓글 작성

router.post("/", authMiddleware, commentsController.createComment);

// 댓글 수정
router.put("/:_commentId", authMiddleware, commentsController.updateComment);

// 댓글 삭제
router.delete("/:_commentId", authMiddleware, commentsController.deleteComment);

module.exports = router;
