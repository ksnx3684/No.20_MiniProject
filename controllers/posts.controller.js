const errorWithCode = require("../utils/error");
const PostsService = require("../services/posts.service");

class PostsController {
  postsService = new PostsService();

  getMainPage = async (req, res, next) => {
    try {
      // 모든 게시글 조회
      const posts = await this.postsService.findAllPosts();

      return res.status(200).json({ posts });
    } catch (e) {
      e.failedApi = "게시글 조회";
      next(e);
    }
  };

  getUserPosts = async (req, res, next) => {
    try {
      const { _nickname } = req.params;
      // _nickname이 number 타입이면 nickname의 게시글 조회가 아닌 게시글 id 조회이므로 다음 미들웨어로 넘김
      // (api/posts/:_nickname -> api/posts/:_postId)
      if (parseInt(_nickname) === Number(_nickname)) {
        return next();
      }

      // 특정 닉네임의 게시글 조회
      const posts = await this.postsService.findUserPosts(_nickname);

      res.status(200).json({ posts });
    } catch (e) {
      e.failedApi = "게시글 조회";
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

      // 게시글 작성
      await this.postsService.createPost(userId, nickname, title, content);

      return res.status(201).end();
    } catch (e) {
      e.failedApi = "게시글 작성";
      next(e);
    }
  };

  // 게시글 상세 조회
  getOnePost = async (req, res, next) => {
    try {
      const { _postId } = req.params;

      const post = await this.postsService.getOnePost(_postId, true);

      return res.status(200).json({ post });
    } catch (e) {
      e.failedApi = "게시글 상세 조회";
      next(e);
    }
  };

  // 게시글 수정
  updatePost = async (req, res, next) => {
    try {
      if (Object.keys(req.body).length !== 2) {
        throw errorWithCode(412, "데이터 형식이 올바르지 않습니다.");
      }

      const { _postId } = req.params;
      const { title, content } = req.body;
      const { nickname } = res.locals.user;
      const postDetail = false;

      const checkPost = await this.postsService.getOnePost(_postId, postDetail);

      if (checkPost.nickname !== nickname) {
        throw errorWithCode(403, "게시글 수정 권한이 존재하지 않습니다.");
      }

      if (!title || title === "") {
        throw errorWithCode(412, "게시글 제목의 형식이 올바르지 않습니다.");
      }

      if (!content || content === "") {
        throw errorWithCode(412, "게시글 내용의 형식이 올바르지 않습니다.");
      }

      await this.postsService.updatePost(_postId, title, content);

      return res.status(200).end();
    } catch (e) {
      e.failedApi = "게시글 수정";
      next(e);
    }
  };

  // 게시글 삭제
  deletePost = async (req, res, next) => {
    try {
      const { _postId } = req.params;
      const { nickname } = res.locals.user;
      const postDetail = false;

      const checkPost = await this.postsService.getOnePost(_postId, postDetail);

      if (!nickname || checkPost.nickname !== nickname) {
        throw errorWithCode(403, "게시글 삭제 권한이 존재하지 않습니다.");
      }

      await this.postsService.deletePost(nickname, _postId);

      return res.status(200).end();
    } catch (e) {
      e.failedApi = "게시글 삭제";
      next(e);
    }
  };
}

module.exports = PostsController;
