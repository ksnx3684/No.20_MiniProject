const express = require("express");
const router = express.Router();
const CommentsController = require("../controllers/comments.controller");
const commentsController = new CommentsController();

router.get("/", commentsController.allComments);
router.post("/", commentsController.createComment);
router.put("/:_commentId", commentsController.updateComment);
router.delete("/:_commentId", commentsController.deleteComment);

module.exports = router;
