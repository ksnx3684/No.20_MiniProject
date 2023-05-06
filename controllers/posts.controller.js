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

      return res.status(201).json({ message: "게시글을 작성했습니다." });
    } catch (e) {
      e.failedApi = "게시글 작성";
      next(e);
    }
  };


  // 게시글 상세 조회
  getOnePost = async (req, res, next) => {
    try {
      const { _nickname, _postId } = req.params;
      const checkPost = await this.postsService.checkPost(_postId);

      if (!checkPost)
        throw errorWithCode(404, "게시글이 존재하지 않습니다.");

      const post = await this.postsService.getOnePost(_nickname, _postId);
        
      return res.status(200).json({ post: post });
    } catch (e) {
      console.log(e);
      e.failedApi = "게시글 조회";
      next(e);
    }
  }

  // 게시글 수정
  updatePost = async (req, res, next) => {
    try {
      if (Object.keys(req.body).length !== 2) {
        throw errorWithCode(412, "데이터 형식이 올바르지 않습니다.");
      }

      const { _nickname, _postId } = req.params;
      const { title, content } = req.body;
      const { nickname } = res.locals.user;
            
      const checkPost = await this.postsService.checkPost(_postId);

      if(!checkPost)
        throw errorWithCode(404, "게시글이 존재하지 않습니다.");
            
      if(checkPost.nickname !== nickname)
        throw errorWithCode(403, "게시글 수정 권한이 존재하지 않습니다.");

      if (!title || title === "") {
        throw errorWithCode(412, "게시글 제목의 형식이 올바르지 않습니다.");
      }

      if (!content || content === "") {
        throw errorWithCode(412, "게시글 내용의 형식이 올바르지 않습니다.");
      }

      await this.postsService.updatePost(_postId, title, content)
        .catch((e) => {
          console.log(e);
          throw errorWithCode(400, "게시글 수정이 정상적으로 처리되지 않았습니다.");
        });

      return res.status(200).send(true);
    } catch (e) {
      console.log(e);
      e.failedApi = "게시글 수정";
      next(e);
    }
  }

  // 게시글 삭제
  deletePost = async (req, res, next) => {
    try {
      const { _nickname, _postId } = req.params;
      const { nickname } = res.locals.user;
      
      const post = await this.postsService.checkPost(_postId);
      
      if (!post)
        throw errorWithCode(404, "게시글이 존재하지 않습니다.");

      if (!nickname || post.nickname !== nickname)
        throw errorWithCode(403, "게시글 삭제 권한이 존재하지 않습니다.");

      await this.postsService.deletePost(nickname, _postId)
        .catch((e) => {
          console.log(e);
          throw errorWithCode(400, "게시글이 정상적으로 삭제되지 않았습니다.");
        });
        
      return res.status(200).send(true);
    } catch (e) {
      console.log(e);
      e.failedApi = "게시글 삭제";
      next(e);
    }
  }
}

module.exports = PostsController;
