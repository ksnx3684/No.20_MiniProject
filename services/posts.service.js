const PostsRepository = require("./../repositories/posts.repository");
const { Posts } = require("./../models/");

class PostsService {
  postsRepository = new PostsRepository(Posts);

  findAllPosts = async () => {
    const posts = await this.postsRepository.findAllPosts();
    if (!posts.length) {
      // TODO: fix (temporary)
      throw new Error();
    }

    posts.sort((a, b) => b.createdAt - a.createdAt);

    return posts.map((post) => {
      return {
        postId: post.postId,
        userId: post.userId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
  };

  findUserPosts = async (nickname) => {
    const posts = await this.postsRepository.findUserPosts(nickname);
    if (!posts.length) {
      // TODO: fix (temporary)
      throw new Error();
    }

    posts.sort((a, b) => b.createdAt - a.createdAt);

    return posts.map((post) => {
      return {
        postId: post.postId,
        userId: post.userId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
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

module.exports = PostService;
