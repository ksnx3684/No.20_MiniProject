const errorWithCode = require("../utils/error");

const PostsRepository = require("./../repositories/posts.repository");
const UsersRepository = require("./../repositories/users.repository");
const { Posts, Users } = require("./../models/");

class PostsService {
  postsRepository = new PostsRepository(Posts);
  usersRepository = new UsersRepository(Users);

  findAllPosts = async () => {
    const posts = await this.postsRepository.findAllPosts();
    if (!posts.length) {
      throw errorWithCode(404, "게시글이 존재하지 않습니다");
    }

    // 최근 생성 순으로 정렬
    posts.sort((a, b) => b.createdAt - a.createdAt);

    // 게시글 갯수를 20개로 제한
    if (posts.length > 20) {
      posts.length = 20;
    }

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

  findUserPosts = async (_nickname) => {
    const user = await this.usersRepository.getUserWithNickname(_nickname);
    if (!user) {
      throw errorWithCode(404, "존재하지 않는 사용자입니다.");
    }

    const posts = await this.postsRepository.findUserPosts(_nickname);
    if (!posts.length) {
      throw errorWithCode(404, "게시글이 존재하지 않습니다");
    }
    // 게시글 갯수를 20개로 제한
    if (posts.length > 20) {
      posts.length = 20;
    }

    // 최근 생성 순으로 정렬
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

  getOnePost = async (_postId) => {
    const post = await this.postsRepository.getOnePost(_postId);
    return post;
  };

  getPrePost = async (_postId) => {
    const post = await this.postsRepository.getOnePost(_postId);
    return post;
  };

  getNextPost = async (_postId) => {
    const post = await this.postsRepository.getOnePost(_postId);
    return post;
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
