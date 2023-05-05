const express = require("express");
const router = express.Router();

const postsRouter = require("./posts.route");
const usersRouter = require('./users.route.js');

router.use('/auth', usersRouter);
router.use("/posts", [postsRouter]);

module.exports = router;