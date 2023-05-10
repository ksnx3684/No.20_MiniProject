const errorWithCode = require("../utils/error");

const PostsRepository = require("./../repositories/posts.repository");
const UsersRepository = require("./../repositories/users.repository");
const { Posts, Users, Comments, Tags } = require("./../models/");

class PostsService {
  postsRepository = new PostsRepository(Posts, Comments, Tags);
  usersRepository = new UsersRepository(Users);

  findAllPosts = async () => {
    const posts = await this.postsRepository.findAllPosts();
    if (!posts.length) {
      throw errorWithCode(404, "게시글이 존재하지 않습니다.");
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
      throw errorWithCode(404, "사용자가 존재하지 않습니다.");
    }

    const posts = await this.postsRepository.findUserPosts(_nickname);
    if (!posts.length) {
      throw errorWithCode(404, "게시글이 존재하지 않습니다.");
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

  createPost = async (userId, nickname, title, content, tag) => {
    const post = await this.postsRepository.createPost(userId, nickname, title, content);
    if(!tag) {
      tag = [];
    }
    const tags = JSON.stringify(tag)
    await this.postsRepository.createTag(post.postId, tags);
  };

  getOnePost = async (_postId, flag) => {
    const post = await this.postsRepository.getOnePost(_postId);
    if (!post) {
      throw errorWithCode(404, "게시글이 존재하지 않습니다.");
    }

    if (!flag) {
      return post;
    }

    const prevPost = await this.postsRepository.getPrevPost(_postId);
    const nextPost = await this.postsRepository.getNextPost(_postId);

    const postWithDetail = {
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      prevPostId: "",
      prevPostTitle: "",
      nextPostId: "",
      nextPostTitle: "",
      postComment: post.Comments,
      tags: post.Tags,
    };

    if (prevPost) {
      postWithDetail.prevPostId = prevPost.postId;
      postWithDetail.prevPostTitle = prevPost.title;
    }

    if (nextPost) {
      postWithDetail.nextPostId = nextPost.postId;
      postWithDetail.nextPostTitle = nextPost.title;
    }

    if (!post.Tags[0].tagName) {
      postWithDetail.tags = [];
    }

    return postWithDetail;
  };

  updatePost = async (_postId, title, content, tag, nickname) => {
    const post = await this.postsRepository.getOnePost(_postId);
    if (!post) {
      throw errorWithCode(404, "게시글이 존재하지 않습니다.");
    }
    if (post.nickname !== nickname) {
      throw errorWithCode(403, "게시글 수정 권한이 존재하지 않습니다.");
    }

    const tags = JSON.stringify(tag);
    await this.postsRepository.updatePost(_postId, title, content);
    await this.postsRepository.updateTag(_postId, tags);
  };

  deletePost = async (nickname, _postId) => {
    const post = await this.postsRepository.getOnePost(_postId);
    if (!post) {
      throw errorWithCode(404, "게시글이 존재하지 않습니다.");
    }
    if (post.nickname !== nickname) {
      throw errorWithCode(403, "게시글 수정 권한이 존재하지 않습니다.");
    }

    await this.postsRepository.deletePost(nickname, _postId);
  };
}

module.exports = PostsService;
