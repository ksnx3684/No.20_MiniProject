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


  // 게시글 상세 조회
  getOnePost = async (req, res, next) => {
    try {
      const { _nickname, _postId } = req.params;
      const checkPost = await this.postsService.checkPost(_postId);

      if (!checkPost)
          return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });

      const post = await this.postsService.getOnePost(_nickname, _postId);
        
      return res.status(200).json({ post: post });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ errorMessage: '게시글 조회에 실패하였습니다.' });
    }
  }

  // 게시글 수정
  updatePost = async (req, res, next) => {
    try {
      const { _nickname, _postId } = req.params;
      const { title, content } = req.body;
      const { nickname } = res.locals.user;
            
      const post = await this.postsService.checkPost(_postId);

      if(!post)
        return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
            
      if(post.nickname !== nickname)
        return res.status(403).json({ errorMessage: '게시글 수정 권한이 존재하지 않습니다.' });

      await this.postsService.updatePost(_postId, title, content)
        .catch((err) => {
          console.log(err);
          return res.status(400).json({ errorMessage: '게시글 수정이 정상적으로 처리되지 않았습니다.' });
        });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode).json({ errorMessage: '게시글 수정에 실패하였습니다.' });
    }
      return res.status(200).json({ message: '게시글 수정에 성공하였습니다.' });
  }

  // 게시글 삭제
  deletePost = async (req, res, next) => {
    try {
      const { _nickname, _postId } = req.params;
      const { nickname } = res.locals.user;
      
      const post = await this.postsService.checkPost(_postId);
      
      if (!post)
        return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });

      if (!nickname || post.nickname !== nickname)
        return res.status(403).json({ errorMessage: '게시글 삭제 권한이 존재하지 않습니다.' });

      await this.postsService.deletePost(nickname, _postId)
        .catch((err) => {
          console.log(err);
          return res.status(400).json({ errorMessage: '게시글이 정상적으로 삭제되지 않았습니다.' });
        });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ errorMessage: '게시글 삭제에 실패하였습니다.' });
    }
      return res.status(200).json({ message: '게시글 삭제에 성공하였습니다.' });
  }
}

module.exports = PostsController;
