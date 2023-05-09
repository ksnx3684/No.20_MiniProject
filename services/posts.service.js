const errorWithCode = require("../utils/error");

const PostsRepository = require("./../repositories/posts.repository");
const UsersRepository = require("./../repositories/users.repository");
const { Posts, Users, Comments } = require("./../models/");

class PostsService {
  postsRepository = new PostsRepository(Posts, Comments);
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
        UserId: post.UserId,
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
        UserId: post.UserId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
      };
    });
  };

  createPost = async (userId, nickname, title, content) => {
    await this.postsRepository.createPost(userId, nickname, title, content);
  };

  getOnePost = async (_postId, postDetail) => {
    const post = await this.postsRepository.getOnePost(_postId);
    if (!post) throw errorWithCode(404, "게시글이 존재하지 않습니다.");

    if(!postDetail) return post;

    const prevPost = await this.postsRepository.getPrevPost(_postId);
    const nextPost = await this.postsRepository.getNextPost(_postId);

    if (!prevPost)
      return {
        nickname: post.nickname,
        title: post.title,
        content: post.content,
        prevPostId: "",
        prevPostTitle: "",
        nextPostId: nextPost.postId,
        nextPostTitle: nextPost.title,
        postComment: post.Comments,
      }
    else if (!nextPost)
      return {
        nickname: post.nickname,
        title: post.title,
        content: post.content,
        prevPostId: prevPost.postId,
        prevPostTitle: prevPost.title,
        nextPostId: "",
        nextPostTitle: "",
        postComment: post.Comments,
      }
    else
      return {
        nickname: post.nickname,
        title: post.title,
        content: post.content,
        prevPostId: prevPost.postId,
        prevPostTitle: prevPost.title,
        nextPostId: nextPost.postId,
        nextPostTitle: nextPost.title,
        postComment: post.Comments,
      }
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
