const PostsController = require("../../../controllers/posts.controller.js");

let mockPostService = {
  findAllPosts: jest.fn(),
  findUserPosts: jest.fn(),
  createPost: jest.fn(),
  getOnePost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

let mockRequest = {
  body: jest.fn(),
  params: jest.fn(),
};

let mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
  locals: jest.fn(),
};

const next = jest.fn();

let postsController = new PostsController();
// postsController의 Service를 Mock Service로 변경합니다.
postsController.postsService = mockPostService;

describe("Layered Architecture Pattern Posts Controller Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });
  });

  test("Posts Controller getMainPage Method by Success", async () => {
    const findAllPostsReturnValue = [
      {
        postId: 1,
        userId: 1,
        nickname: "nickname1",
        title: "title1",
        createdAt: new Date("27 April 2023 00:00"),
        updatedAt: new Date("27 April 2023 00:00"),
      },
      {
        postId: 2,
        userId: 2,
        nickname: "nickname2",
        title: "title2",
        createdAt: new Date("28 April 2023 00:00"),
        updatedAt: new Date("28 April 2023 00:00"),
      },
    ];
    mockPostService.findAllPosts = jest.fn(() => {
      return findAllPostsReturnValue;
    });

    await postsController.getMainPage(mockRequest, mockResponse, next);

    // 1. findAllPosts 메서드가 한 번 호출되었는가
    expect(mockPostService.findAllPosts).toHaveBeenCalledTimes(1);

    // 2. Response.status가 200으로 정상 전달되었는가
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // 3. Response.json이 {data: posts} 형태로 정상 전달 되었는가
    expect(mockResponse.json).toHaveBeenCalledWith({
      posts: findAllPostsReturnValue,
    });
  });

  test("Posts Controller getMainPage Method by Failed", async () => {
    const findAllPostsReturnValue = [];
    mockPostService.findAllPosts = jest.fn(() => {
      return findAllPostsReturnValue;
    });

    try {
      await postsController.getUserPosts(mockRequest, mockResponse, next);
    } catch (e) {
      expect(mockResponse.status).toHaveBeenCalledTimes(0);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    }
  });

  test("Posts Controller getUserPosts Method by Success", async () => {
    const findUserPostsReturnValue = [
      {
        postId: 1,
        userId: 1,
        nickname: "nickname1",
        title: "title1",
        createdAt: new Date("27 April 2023 00:00"),
      },
      {
        postId: 2,
        userId: 2,
        nickname: "nickname2",
        title: "title2",
        createdAt: new Date("28 April 2023 00:00"),
      },
    ];
    mockPostService.findUserPosts = jest.fn(() => {
      return findUserPostsReturnValue;
    });

    await postsController.getUserPosts(mockRequest, mockResponse, next);

    // 1. findAllPosts 메서드가 한 번 호출되었는가
    expect(mockPostService.findUserPosts).toHaveBeenCalledTimes(1);

    // 2. Response.status가 200으로 정상 전달되었는가
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // 3. Response.json이 {data: posts} 형태로 정상 전달 되었는가
    expect(mockResponse.json).toHaveBeenCalledWith({
      posts: findUserPostsReturnValue,
    });
  });

  test("Posts Controller getUserPosts Method by Failed", async () => {
    const findUserPostsReturnValue = [
      {
        postId: 1,
        userId: 1,
        nickname: "nickname1",
        title: "title1",
        createdAt: new Date("27 April 2023 00:00"),
      },
      {
        postId: 2,
        userId: 2,
        nickname: "nickname2",
        title: "title2",
        createdAt: new Date("28 April 2023 00:00"),
      },
    ];
    mockPostService.findUserPosts = jest.fn(() => {
      return findUserPostsReturnValue;
    });
    try {
      await postsController.getMainPage(mockRequest, mockResponse, next);
    } catch (e) {
      expect(mockResponse.status).toHaveBeenCalledTimes(0);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    }
  });

  test("Posts Controller createPost Method by Success", async () => {
    const createPostBodyParams = {
      title: "title1",
      content: "content1",
    };
    mockRequest.body = createPostBodyParams;

    const createPostLocalsUser = {
      userId: "test",
      nickname: "test",
    };
    mockResponse.locals.user = createPostLocalsUser;

    const createPostReturnValue = {
      title: "title1",
      content: "content1",
      userId: "test",
      nickname: "test",
    };

    mockPostService.createPost = jest.fn(() => {
      return createPostReturnValue;
    });

    await postsController.createPost(mockRequest, mockResponse, next);

    // 1. Request에 있는 body 데이터가 정상적으로 createPost에 전달되었는가
    expect(mockPostService.createPost).toHaveBeenCalledTimes(1);
    expect(mockPostService.createPost).toHaveBeenCalledWith(
      createPostLocalsUser.userId,
      createPostLocalsUser.nickname,
      createPostBodyParams.title,
      createPostBodyParams.content
    );

    // 2. mockResponse.json을 호출하는데, createPost의 Return Value가 맞는가
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "게시글 작성에 성공하였습니다.",
    });

    // 3. mockResponse.status는 201로 정상 전달되었는지 검증한다.
    expect(mockResponse.status).toHaveBeenCalledWith(201);
  });

  test("Posts Controller createPost Method by Failed", async () => {
    const createPostBodyParams = {
      title: "title1",
      content: "content1",
    };
    mockRequest.body = createPostBodyParams;

    mockPostService.createPost = jest.fn(() => {
      return createPostBodyParams;
    });
    try {
      await postsController.createPost(mockRequest, mockResponse, next);
    } catch (e) {
      expect(mockResponse.status).toHaveBeenCalledTimes(0);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    }
  });

  test("Posts Controller getOnePost Method by Success", async () => {
    const getOnePostReturnValue = [
      {
        nickname: "nickname1",
        title: "title1",
        content: "content1",
        prevPostId: 1,
        prevPostTitle: "title",
        nextPostId: 3,
        nextPostTitle: "title",
      },
    ];
    mockPostService.getOnePost = jest.fn(() => {
      return getOnePostReturnValue;
    });

    await postsController.getOnePost(mockRequest, mockResponse, next);

    // 1. getOnePost 메서드가 한 번 호출되었는가
    expect(mockPostService.getOnePost).toHaveBeenCalledTimes(1);

    // 2. Response.status가 200으로 정상 전달되었는가
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // 3. Response.json이 {data: posts} 형태로 정상 전달 되었는가
    expect(mockResponse.json).toHaveBeenCalledWith({
      post: getOnePostReturnValue,
    });
  });

  test("Posts Controller getOnePost Method by Failed", async () => {
    const getOnePostReturnValue = [
      {
        nickname: "nickname1",
        title: "title1",
        content: "content1",
        prevPostId: 1,
        prevPostTitle: "title",
        nextPostId: 3,
        nextPostTitle: "title",
      },
    ];
    mockPostService.getOnePost = jest.fn(() => {
      return getOnePostReturnValue;
    });
    try {
      await postsController.getOnePost(mockRequest, mockResponse, next);
    } catch (e) {
      expect(mockResponse.status).toHaveBeenCalledTimes(0);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    }
  });

  // test('Posts Controller updatePost Method by Success', async () => {
  //   const updatePostBodyParams = {
  //       title: 'title1',
  //       content: 'content1',
  //   };

  //   const getOnePostReturnValue = [
  //     {
  //       nickname: 'nickname1',
  //       title: 'title1',
  //       content: 'content1',
  //       prevPostId: 1,
  //       prevPostTitle: "title",
  //       nextPostId: 3,
  //       nextPostTitle: "title",
  //       postComment: []
  //     },
  //   ];

  //   mockRequest.body = updatePostBodyParams;
  //   mockRequest.params = {_postId: 1};
  //   mockResponse.locals.user = {nickname: 'test'};

  //   mockPostService.getOnePost = jest.fn(() => {
  //     return getOnePostReturnValue;
  //   });

  //   mockPostService.updatePost = jest.fn(() => {
  //     return updatePostBodyParams;
  //   });

  //   await postsController.updatePost(mockRequest, mockResponse, next);
  //   expect(mockPostService.updatePost).toHaveBeenCalledTimes(1);
  //   expect(mockPostService.updatePost).toHaveBeenCalledWith(
  //     mockRequest.params._postId,
  //     updatePostBodyParams.title,
  //     updatePostBodyParams.content,
  //   );
  // });

  test("Posts Controller updatePost Method by Failed", async () => {
    const updatePostBodyParams = [
      {
        title: "title1",
        content: "content1",
      },
    ];
    mockPostService.updatePost = jest.fn(() => {
      return updatePostBodyParams;
    });
    try {
      await postsController.updatePost(mockRequest, mockResponse, next);
    } catch (e) {
      expect(mockResponse.status).toHaveBeenCalledTimes(0);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    }
  });

  // test('Posts Controller deletePost Method by Success', async () => {
  //   mockRequest.params = { postId: 1 };

  //   const getOnePostReturnValue = [
  //     {
  //       nickname: 'nickname1',
  //       title: 'title1',
  //       content: 'content1',
  //       prevPostId: 1,
  //       prevPostTitle: "title",
  //       nextPostId: 3,
  //       nextPostTitle: "title",
  //       postComment: []
  //     },
  //   ];

  //   mockPostService.getOnePost = jest.fn(() => {
  //     return getOnePostReturnValue;
  //   })
  //   mockPostService.deletePost = jest.fn(() => {
  //     return deletePostMessage;
  //   })

  //   await postsController.deletePost(mockRequest, mockResponse, next);
  //   expect(mockPostService.deletePost).toHaveBeenCalledTimes(1);

  // });

  test("Posts Controller deletePost Method by Failed", async () => {
    mockPostService.deletePost = jest.fn(() => {});
    try {
      await postsController.deletePost(mockRequest, mockResponse, next);
    } catch (e) {
      expect(mockResponse.status).toHaveBeenCalledTimes(0);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    }
  });
});
