const errorWithCode = require("../utils/error");

const PostsService = require("../services/posts.service");

class PostsController {
  postsService = new PostsService();

  getMainPage = async (req, res, next) => {
    try {
      const posts = await this.postsService.findAllPosts();

      res.status(200).json({ posts });
    } catch (e) {
      next(e);
    }
  };

  getUserPosts = async (req, res, next) => {
    try {
      const nickname = req.params._nickname;

      const posts = await this.postsService.findUserPosts(nickname);

      res.status(200).json({ posts });
    } catch (e) {
      next(e);
    }
  };

  createPost = async (req, res, next) => {
    try {
      if (Object.keys(req.body).length !== 2) {
        throw errorWithCode(412, "데이터 형식이 올바르지 않습니다.");
      }

      const { userId, nickname } = res.locals.user;
      const { title, content } = req.body;

      if (!title || title === "") {
        throw errorWithCode(412, "게시글 제목의 형식이 올바르지 않습니다.");
      }
      if (!content || content === "") {
        throw errorWithCode(412, "게시글 내용의 형식이 올바르지 않습니다.");
      }

      await this.postsService.createPost(userId, nickname, title, content);

      res.status(201).json({ message: "게시글을 작성했습니다." });
    } catch (e) {
      e.failedApi = "게시글 작성";
      next(e);
    }
  };
}

module.exports = PostsController;
