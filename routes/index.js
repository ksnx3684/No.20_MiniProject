const express = require("express");
const router = express.Router();

const postsRouter = require("./posts.route");
const usersRouter = require("./users.route.js");
const commentsRouter = require("./comments.route.js");

router.use("/auth", usersRouter);
router.use("/posts", [postsRouter]);
router.use("/posts/:_postId/comments", commentsRouter);

module.exports = router;
