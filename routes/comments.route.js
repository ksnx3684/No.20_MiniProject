const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middlewares/auth-middleware");
const CommentsController = require("../controllers/comments.controller");
const commentsController = new CommentsController();

router.get("/", commentsController.allComments);
router.post("/", authMiddleware, commentsController.createComment);
router.put("/:_commentId", authMiddleware, commentsController.updateComment);
router.delete("/:_commentId", authMiddleware, commentsController.deleteComment);

module.exports = router;
