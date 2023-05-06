const errorWithCode = require("../utils/error");

const PostsRepository = require("./../repositories/posts.repository");
const { Posts } = require("./../models/");

class PostsService {
  postsRepository = new PostsRepository(Posts);

  findAllPosts = async () => {
    const posts = await this.postsRepository.findAllPosts();
    if (!posts.length) {
      throw errorWithCode(404, "게시글이 존재하지 않습니다");
    }

    if (posts.length > 20) {
      posts.length = 20;
    }

    posts.sort((a, b) => b.createdAt - a.createdAt);

    return posts.map((post) => {
      return {
        postId: post.postId,
        userId: post.UserId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
      };
    });
  };

  findUserPosts = async (nickname) => {
    const posts = await this.postsRepository.findUserPosts(nickname);
    if (!posts.length) {
      throw errorWithCode(404, "게시글이 존재하지 않습니다");
    }

    if (posts.length > 20) {
      posts.length = 20;
    }

    posts.sort((a, b) => b.createdAt - a.createdAt);

    return posts.map((post) => {
      return {
        postId: post.postId,
        userId: post.UserId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
      };
    });
  };

  createPost = async (userId, nickname, title, content) => {
    await this.postsRepository.createPost(userId, nickname, title, content);
  };

  getOnePost = async (_nickname, _postId) => {
    const post = await this.postsRepository.getOnePost(_nickname, _postId);
    const prevPost = await this.postsRepository.getPrevPost(_nickname, _postId);
    const nextPost = await this.postsRepository.getNextPost(_nickname, _postId);

    if (!prevPost)
      return {
        nickname: _nickname,
        title: post.title,
        content: post.content,
        prevPostId: '',
        prevPostTitle: '',
        nextPostId: nextPost.postId,
        nextPostTitle: nextPost.title
      }
    
    if (!nextPost)
      return {
        nickname: _nickname,
        title: post.title,
        content: post.content,
        prevPostId: prevPost.postId,
        prevPostTitle: prevPost.title,
        nextPostId: '',
        nextPostTitle: ''
      }
    else {
      return {
        nickname: _nickname,
        title: post.title,
        content: post.content,
        prevPostId: prevPost.postId,
        prevPostTitle: prevPost.title,
        nextPostId: nextPost.postId,
        nextPostTitle: nextPost.title
      }
    }
  };

  checkPost = async (_postId) => {
    const post = await this.postsRepository.checkPost(_postId);
    return post;
  };

  updatePost = async (_postId, title, content) => {
    const post = await this.postsRepository.updatePost(_postId, title, content);
    return post;
  };

  deletePost = async (nickname, _postId) => {
    const post = await this.postsRepository.deletePost(nickname, _postId);
    return post;
  };
}

module.exports = PostsService;
