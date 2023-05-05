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
    const post = await this.postRepository.getOnePost(_nickname, _postId);
    return post;
  };

  getPrePost = async (_nickname, _postId) => {
    const post = await this.postRepository.getOnePost(_nickname, _postId);
    return post;
  };

  getNextPost = async (_nickname, _postId) => {
    const post = await this.postRepository.getOnePost(_nickname, _postId);
    return post;
  };

  checkPost = async (_postId) => {
    const post = await this.postRepository.checkPost(_postId);
    return post;
  };

  updatePost = async (_postId, title, content) => {
    const post = await this.postRepository.updatePost(_postId, title, content);
    return post;
  };

  deletePost = async (nickname, _postId) => {
    const post = await this.postRepository.deletePost(nickname, _postId);
    return post;
  };
}


module.exports = PostsService;
