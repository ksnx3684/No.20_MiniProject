const PostsService = require("../services/posts.service");

class PostsController {
  postsService = new PostsService();

  getMainPage = async (req, res, next) => {
    try {
      const posts = await this.postsService.findAllPosts();

      res.status(200).json({ posts });
    } catch (e) {
      // TODO: fix (temoporary)
      res.status(400).json({ errorMessage: "게시글 조회에 실패했습니다." });
    }
  };

  getUserPosts = async (req, res, next) => {
    try {
      const nickname = req.params._nickname;

      const posts = await this.postsService.findUserPosts(nickname);

      res.status(200).json({ posts });
    } catch (e) {
      // TODO: fix (temoporary)
      res.status(400).json({ errorMessage: "게시글 조회에 실패했습니다." });
    }
  };

  createPost = async (req, res, next) => {
    try {
      if (Object.keys(req.body).length !== 2) {
        // TODO: fix (temoporary)
        throw new Error();
      }

      const { userId, nickname } = res.locals.user;
      const { title, content } = req.body;

      if (!title || title === "") {
        // TODO: fix (temoporary)
        throw new Error();
      }
      if (!content || content === "") {
        // TODO: fix (temoporary)
        throw new Error();
      }

      await this.postsService.createPost(userId, nickname, title, content);

      res.status(201).json({ message: "게시글을 작성했습니다." });
    } catch (e) {
      // TODO: fix (temoporary)
      res.status(400).json({ errorMessage: "게시글 작성에 실패했습니다." });
    }
  };
}
