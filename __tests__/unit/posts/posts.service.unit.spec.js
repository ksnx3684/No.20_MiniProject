const PostsService = require("./../../../services/posts.service");

let mockPostsRepository = {
  findAllPosts: jest.fn(),
  findUserPosts: jest.fn(),
  createPost: jest.fn(),
  getOnePost: jest.fn(),
  getPrevPost: jest.fn(),
  getNextPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

let mockUsersRepository = {
  getUserWithNickname: jest.fn(),
};

let postsService = new PostsService();
postsService.postsRepository = mockPostsRepository;
postsService.usersRepository = mockUsersRepository;

describe("[Posts Service] Unit Test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // 전체 게시글 조회 (return, no params) (성공)
  test("findAllPosts (success)", async () => {
    // 전체 게시글 배열
    const allPosts = [];
    for (let i = 0; i < 40; i++) {
      allPosts.push({
        postId: i + 1,
        UserId: i + 1,
        nickname: `nickname_${i + 1}`,
        title: `title_${i + 1}`,
        content: `content_${i + 1}`,
        likes: 10,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    mockPostsRepository.findAllPosts = jest.fn(() => {
      return allPosts;
    });

    const posts = await postsService.findAllPosts();

    allPosts.sort((a, b) => b.createdAt - a.createdAt);

    allPosts.length = 20;

    allPosts.forEach((post) => {
      delete post.content;
      delete post.likes;
      delete post.status;
      delete post.updatedAt;
    });

    expect(postsService.postsRepository.findAllPosts).toHaveBeenCalledTimes(1);

    expect(postsService.postsRepository.findAllPosts).toHaveBeenCalledWith();

    expect(posts).toEqual(allPosts);
  });

  // 전체 게시글 조회 (return, no params) (실패)
  test("findAllPosts (failure)", async () => {
    // 전체 게시글 배열
    const allPosts = [];

    mockPostsRepository.findAllPosts = jest.fn(() => {
      return allPosts;
    });

    try {
      const posts = await postsService.findAllPosts();

      expect(postsService.postsRepository.findAllPosts).toHaveBeenCalledTimes(
        1
      );

      expect(postsService.postsRepository.findAllPosts).toHaveBeenCalledWith();

      expect(posts).toEqual(allPosts);
    } catch (e) {
      expect(e.statusCode).toEqual(404);

      expect(e.message).toEqual("게시글이 존재하지 않습니다.");
    }
  });

  // 특정 닉네임이 작성한 게시글 조회 (return, 1 param) (성공)
  test("findUserPosts (success)", async () => {
    const nickname = "nickname_1";

    // 전체 게시글 배열
    const allPosts = [];
    for (let i = 0; i < 40; i++) {
      allPosts.push({
        postId: i + 1,
        UserId: 1,
        nickname: `nickname_1`,
        title: `title_${i + 1}`,
        content: `content_${i + 1}`,
        likes: 10,
        status: true,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
      if (!(i % 3)) {
        allPosts[i].UserId = i + 1;
        allPosts[i].nickname = `nickname_${i + 1}`;
      }
    }

    mockPostsRepository.findUserPosts = jest.fn(() => {
      return allPosts.filter((post) => post.nickname === nickname);
    });

    mockUsersRepository.getUserWithNickname = jest.fn(() => "temp");

    const posts = await postsService.findUserPosts(nickname);

    const userPosts = allPosts
      .filter((post) => post.nickname === nickname)
      .sort((a, b) => b.createdAt - a.createdAt);

    userPosts.length = 20;

    userPosts.forEach((post) => {
      delete post.content;
      delete post.likes;
      delete post.status;
      delete post.updatedAt;
    });

    expect(
      postsService.usersRepository.getUserWithNickname
    ).toHaveBeenCalledTimes(1);

    expect(
      postsService.usersRepository.getUserWithNickname
    ).toHaveBeenCalledWith(nickname);

    expect(postsService.postsRepository.findUserPosts).toHaveBeenCalledTimes(1);

    expect(postsService.postsRepository.findUserPosts).toHaveBeenCalledWith(
      nickname
    );

    expect(posts).toEqual(userPosts);
  });

  // 특정 닉네임이 작성한 게시글 조회 (return, 1 param) (실패: 사용자가 없는 경우)
  test("findUserPosts (failure: user not found)", async () => {
    const nickname = "nickname_1";

    // 전체 게시글 배열
    const allPosts = [];
    for (let i = 0; i < 40; i++) {
      allPosts.push({
        postId: i + 1,
        UserId: 1,
        nickname: `nickname_1`,
        title: `title_${i + 1}`,
        content: `content_${i + 1}`,
        likes: 10,
        status: true,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
      if (!(i % 3)) {
        allPosts[i].UserId = i + 1;
        allPosts[i].nickname = `nickname_${i + 1}`;
      }
    }

    mockPostsRepository.findUserPosts = jest.fn(() => {
      return allPosts.filter((post) => post.nickname === nickname);
    });

    mockUsersRepository.getUserWithNickname = jest.fn(() => {});

    try {
      await postsService.findUserPosts(nickname);

      expect(
        postsService.usersRepository.getUserWithNickname
      ).toHaveBeenCalledTimes(1);

      expect(
        postsService.usersRepository.getUserWithNickname
      ).toHaveBeenCalledWith(nickname);
    } catch (e) {
      expect(postsService.postsRepository.findUserPosts).toHaveBeenCalledTimes(
        0
      );

      expect(e.statusCode).toEqual(404);

      expect(e.message).toEqual("사용자가 존재하지 않습니다.");
    }
  });

  // 특정 닉네임이 작성한 게시글 조회 (return, 1 param) (실패: 게시글이 없는 경우)
  test("findUserPosts (failure: posts not found)", async () => {
    const nickname = "nickname_1";

    // 전체 게시글 배열
    const allPosts = [];

    mockPostsRepository.findUserPosts = jest.fn(() => {
      return allPosts.filter((post) => post.nickname === nickname);
    });

    mockUsersRepository.getUserWithNickname = jest.fn(() => "user");

    try {
      const posts = await postsService.findUserPosts(nickname);

      const userPosts = allPosts
        .filter((post) => post.nickname === nickname)
        .sort((a, b) => b.createdAt - a.createdAt);

      userPosts.length = 20;

      userPosts.forEach((post) => {
        delete post.content;
        delete post.likes;
        delete post.status;
        delete post.updatedAt;
      });

      expect(
        postsService.usersRepository.getUserWithNickname
      ).toHaveBeenCalledTimes(1);

      expect(
        postsService.usersRepository.getUserWithNickname
      ).toHaveBeenCalledWith(nickname);

      expect(postsService.postsRepository.findUserPosts).toHaveBeenCalledTimes(
        1
      );

      expect(postsService.postsRepository.findUserPosts).toHaveBeenCalledWith(
        nickname
      );

      expect(posts).toEqual(userPosts);
    } catch (e) {
      expect(e.statusCode).toEqual(404);

      expect(e.message).toEqual("게시글이 존재하지 않습니다.");
    }
  });

  // 게시글 작성 (no return, 4 params) (실패 없음)
  test("createPost (success)", async () => {
    const [userId, nickname, title, content] = [
      1,
      "nickname,",
      "title",
      "content",
    ];

    mockPostsRepository.createPost = jest.fn(() => {});

    await postsService.createPost(userId, nickname, title, content);

    expect(postsService.postsRepository.createPost).toHaveBeenCalledTimes(1);

    expect(postsService.postsRepository.createPost).toHaveBeenCalledWith(
      userId,
      nickname,
      title,
      content
    );
  });

  // 게시글 상세 조회 (return, 2 params) (성공: 단순 조회)
  test("getOnePost (success: simple find)", async () => {
    const [postId, postDetail] = [1, false];

    const allPosts = [];
    for (let i = 0; i < 40; i++) {
      allPosts.push({
        postId: i + 1,
        UserId: i + 1,
        nickname: `nickname_${i + 1}`,
        title: `title_${i + 1}`,
        content: `content_${i + 1}`,
        likes: 10,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    mockPostsRepository.getOnePost = jest.fn(() => {
      for (let i = 0; i < allPosts.length; i++) {
        if (allPosts[i].postId === postId) {
          return allPosts[i];
        }
      }
    });

    const post = await postsService.getOnePost(postId, postDetail);

    expect(postsService.postsRepository.getOnePost).toHaveBeenCalledTimes(1);

    expect(postsService.postsRepository.getOnePost).toHaveBeenCalledWith(
      postId
    );

    expect(post).toEqual(allPosts[0]);

    expect(postsService.postsRepository.getPrevPost).toHaveBeenCalledTimes(0);

    expect(postsService.postsRepository.getNextPost).toHaveBeenCalledTimes(0);
  });

  // 게시글 상세 조회 (return, 2 params) (실패: 게시글이 없는 경우)
  test("getOnePost (failure: post not found)", async () => {
    const [postId, postDetail] = [41, false];

    const allPosts = [];
    for (let i = 0; i < 40; i++) {
      allPosts.push({
        postId: i + 1,
        UserId: i + 1,
        nickname: `nickname_${i + 1}`,
        title: `title_${i + 1}`,
        content: `content_${i + 1}`,
        likes: 10,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    mockPostsRepository.getOnePost = jest.fn(() => {
      for (let i = 0; i < allPosts.length; i++) {
        if (allPosts[i].postId === postId) {
          return allPosts[i];
        }
      }
    });

    try {
      await postsService.getOnePost(postId, postDetail);

      expect(postsService.postsRepository.getOnePost).toHaveBeenCalledTimes(1);

      expect(postsService.postsRepository.getOnePost).toHaveBeenCalledWith(
        postId
      );

      expect(postsService.postsRepository.getPrevPost).toHaveBeenCalledTimes(0);

      expect(postsService.postsRepository.getNextPost).toHaveBeenCalledTimes(0);
    } catch (e) {
      expect(e.statusCode).toEqual(404);

      expect(e.message).toEqual("게시글이 존재하지 않습니다.");
    }
  });

  // 게시글 상세 조회 (return, 2 params) (성공: prev next 둘 다 존재)
  test("getOnePost (success: has both prev and next)", async () => {
    const [postId, postDetail] = [2, true];

    const allPosts = [];
    for (let i = 0; i < 3; i++) {
      allPosts.push({
        postId: i + 1,
        UserId: i + 1,
        nickname: `nickname_${i + 1}`,
        title: `title_${i + 1}`,
        content: `content_${i + 1}`,
        likes: 10,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    mockPostsRepository.getOnePost = jest.fn(() => {
      for (let i = 0; i < allPosts.length; i++) {
        if (allPosts[i].postId === postId) {
          return allPosts[i];
        }
      }
    });

    mockPostsRepository.getPrevPost = jest.fn(() => {
      for (let i = 0; i < allPosts.length; i++) {
        if (allPosts[i].postId === postId) {
          return allPosts[i - 1];
        }
      }
    });

    mockPostsRepository.getNextPost = jest.fn(() => {
      for (let i = 0; i < allPosts.length; i++) {
        if (allPosts[i].postId === postId) {
          return allPosts[i + 1];
        }
      }
    });

    const post = await postsService.getOnePost(postId, postDetail);

    expect(postsService.postsRepository.getOnePost).toHaveBeenCalledTimes(1);

    expect(postsService.postsRepository.getOnePost).toHaveBeenCalledWith(
      postId
    );

    expect(postsService.postsRepository.getPrevPost).toHaveBeenCalledTimes(1);

    expect(postsService.postsRepository.getPrevPost).toHaveBeenCalledWith(
      postId
    );

    expect(postsService.postsRepository.getNextPost).toHaveBeenCalledTimes(1);

    expect(postsService.postsRepository.getNextPost).toHaveBeenCalledWith(
      postId
    );

    const curPost = await postsService.postsRepository.getOnePost(postId);
    const prevPost = await postsService.postsRepository.getPrevPost(postId);
    const nextPost = await postsService.postsRepository.getNextPost(postId);

    expect(curPost).toEqual(allPosts[1]);

    expect(prevPost).toEqual(allPosts[0]);

    expect(nextPost).toEqual(allPosts[2]);

    expect(post).toEqual({
      nickname: curPost.nickname,
      title: curPost.title,
      content: curPost.content,
      prevPostId: prevPost.postId,
      prevPostTitle: prevPost.title,
      nextPostId: nextPost.postId,
      nextPostTitle: nextPost.title,
      postComment: curPost.Comments,
    });
  });

  // 게시글 상세 조회 (return, 2 params) (성공: prev만 존재)
  test("getOnePost (success: has only prev)", async () => {
    const [postId, postDetail] = [3, true];

    const allPosts = [];
    for (let i = 0; i < 3; i++) {
      allPosts.push({
        postId: i + 1,
        UserId: i + 1,
        nickname: `nickname_${i + 1}`,
        title: `title_${i + 1}`,
        content: `content_${i + 1}`,
        likes: 10,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    mockPostsRepository.getOnePost = jest.fn(() => {
      for (let i = 0; i < allPosts.length; i++) {
        if (allPosts[i].postId === postId) {
          return allPosts[i];
        }
      }
    });

    mockPostsRepository.getPrevPost = jest.fn(() => {
      for (let i = 0; i < allPosts.length; i++) {
        if (allPosts[i].postId === postId) {
          return allPosts[i - 1];
        }
      }
    });

    mockPostsRepository.getNextPost = jest.fn(() => {
      for (let i = 0; i < allPosts.length; i++) {
        if (allPosts[i].postId === postId) {
          return allPosts[i + 1];
        }
      }
    });

    const post = await postsService.getOnePost(postId, postDetail);

    expect(postsService.postsRepository.getOnePost).toHaveBeenCalledTimes(1);

    expect(postsService.postsRepository.getOnePost).toHaveBeenCalledWith(
      postId
    );

    expect(postsService.postsRepository.getPrevPost).toHaveBeenCalledTimes(1);

    expect(postsService.postsRepository.getPrevPost).toHaveBeenCalledWith(
      postId
    );

    expect(postsService.postsRepository.getNextPost).toHaveBeenCalledTimes(1);

    expect(postsService.postsRepository.getNextPost).toHaveBeenCalledWith(
      postId
    );

    const curPost = await postsService.postsRepository.getOnePost(postId);
    const prevPost = await postsService.postsRepository.getPrevPost(postId);
    const nextPost = await postsService.postsRepository.getNextPost(postId);

    expect(curPost).toEqual(allPosts[2]);

    expect(prevPost).toEqual(allPosts[1]);

    expect(nextPost).toEqual(undefined);

    expect(post).toEqual({
      nickname: curPost.nickname,
      title: curPost.title,
      content: curPost.content,
      prevPostId: prevPost.postId,
      prevPostTitle: prevPost.title,
      nextPostId: "",
      nextPostTitle: "",
      postComment: curPost.Comments,
    });
  });

  // 게시글 상세 조회 (return, 2 params) (성공: next만 존재)
  test("getOnePost (success: has only next)", async () => {
    const [postId, postDetail] = [1, true];

    const allPosts = [];
    for (let i = 0; i < 3; i++) {
      allPosts.push({
        postId: i + 1,
        UserId: i + 1,
        nickname: `nickname_${i + 1}`,
        title: `title_${i + 1}`,
        content: `content_${i + 1}`,
        likes: 10,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    mockPostsRepository.getOnePost = jest.fn(() => {
      for (let i = 0; i < allPosts.length; i++) {
        if (allPosts[i].postId === postId) {
          return allPosts[i];
        }
      }
    });

    mockPostsRepository.getPrevPost = jest.fn(() => {
      for (let i = 0; i < allPosts.length; i++) {
        if (allPosts[i].postId === postId) {
          return allPosts[i - 1];
        }
      }
    });

    mockPostsRepository.getNextPost = jest.fn(() => {
      for (let i = 0; i < allPosts.length; i++) {
        if (allPosts[i].postId === postId) {
          return allPosts[i + 1];
        }
      }
    });

    const post = await postsService.getOnePost(postId, postDetail);

    expect(postsService.postsRepository.getOnePost).toHaveBeenCalledTimes(1);

    expect(postsService.postsRepository.getOnePost).toHaveBeenCalledWith(
      postId
    );

    expect(postsService.postsRepository.getPrevPost).toHaveBeenCalledTimes(1);

    expect(postsService.postsRepository.getPrevPost).toHaveBeenCalledWith(
      postId
    );

    expect(postsService.postsRepository.getNextPost).toHaveBeenCalledTimes(1);

    expect(postsService.postsRepository.getNextPost).toHaveBeenCalledWith(
      postId
    );

    const curPost = await postsService.postsRepository.getOnePost(postId);
    const prevPost = await postsService.postsRepository.getPrevPost(postId);
    const nextPost = await postsService.postsRepository.getNextPost(postId);

    expect(curPost).toEqual(allPosts[0]);

    expect(prevPost).toEqual(undefined);

    expect(nextPost).toEqual(allPosts[1]);

    expect(post).toEqual({
      nickname: curPost.nickname,
      title: curPost.title,
      content: curPost.content,
      prevPostId: "",
      prevPostTitle: "",
      nextPostId: nextPost.postId,
      nextPostTitle: nextPost.title,
      postComment: curPost.Comments,
    });
  });

  // 게시글 수정 (return, 3 params) (실패 없음)
  test("updatePost", async () => {
    const [postId, title, content] = [1, "title", "content"];

    const allPosts = [];
    for (let i = 0; i < 3; i++) {
      allPosts.push({
        postId: i + 1,
        UserId: i + 1,
        nickname: `nickname_${i + 1}`,
        title: `title_${i + 1}`,
        content: `content_${i + 1}`,
        likes: 10,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    mockPostsRepository.updatePost = jest.fn(() => {
      for (let post of allPosts) {
        if (post.postId === postId) {
          post.title = title;
          post.content = content;
          return post;
        }
      }
    });

    const updatedPost = await postsService.updatePost(postId, title, content);

    expect(postsService.postsRepository.updatePost).toHaveBeenCalledTimes(1);

    expect(postsService.postsRepository.updatePost).toHaveBeenCalledWith(
      postId,
      title,
      content
    );

    expect(updatedPost).toEqual({
      postId: allPosts[0].postId,
      UserId: allPosts[0].UserId,
      nickname: allPosts[0].nickname,
      title: title,
      content: content,
      likes: allPosts[0].likes,
      status: allPosts[0].status,
      createdAt: expect.anything(),
      updatedAt: expect.anything(),
    });
  });

  // 게시글 수정 (return, 2 params) (실패 없음)
  test("deletePost", async () => {
    const [nickname, postId] = ["nickname_1", 1];

    const allPosts = [];
    for (let i = 0; i < 3; i++) {
      allPosts.push({
        postId: i + 1,
        UserId: i + 1,
        nickname: `nickname_${i + 1}`,
        title: `title_${i + 1}`,
        content: `content_${i + 1}`,
        likes: 10,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    mockPostsRepository.deletePost = jest.fn(() => {
      for (let post of allPosts) {
        if (post.postId === postId) {
          post.status = false;
          return post;
        }
      }
    });

    const deletedPost = await postsService.deletePost(nickname, postId);

    expect(postsService.postsRepository.deletePost).toHaveBeenCalledTimes(1);

    expect(postsService.postsRepository.deletePost).toHaveBeenCalledWith(
      nickname,
      postId
    );

    expect(deletedPost).toEqual({
      postId: allPosts[0].postId,
      UserId: allPosts[0].UserId,
      nickname: allPosts[0].nickname,
      title: allPosts[0].title,
      content: allPosts[0].content,
      likes: allPosts[0].likes,
      status: false,
      createdAt: expect.anything(),
      updatedAt: expect.anything(),
    });
  });
});
