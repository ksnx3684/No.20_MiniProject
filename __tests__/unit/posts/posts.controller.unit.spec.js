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
    // 준비
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
    
    // 실행
    await postsController.getMainPage(mockRequest, mockResponse, next);

    // 검증
    // findAllPosts 메서드가 한 번 호출되었는가
    expect(mockPostService.findAllPosts).toHaveBeenCalledTimes(1);

    // Response.status가 200으로 정상 전달되었는가
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // Response.json이 {data: posts} 형태로 정상 전달 되었는가
    expect(mockResponse.json).toHaveBeenCalledWith({
      posts: findAllPostsReturnValue,
    });
  });

  test("Posts Controller getMainPage Method by Failed", async () => {
    // 준비
    const findAllPostsReturnValue = [];
    mockPostService.findAllPosts = jest.fn(() => {
      return findAllPostsReturnValue;
    });

    try {
      // 실행
      await postsController.getUserPosts(mockRequest, mockResponse, next);
    } catch (e) {
      // 검증
      expect(e.statusCode).toHaveBeenCalledWith(400);
    }
  });

  test("Posts Controller getUserPosts Method by Success", async () => {
    // 준비
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

    // 실행
    await postsController.getUserPosts(mockRequest, mockResponse, next);

    // 검증
    // findAllPosts 메서드가 한 번 호출되었는가
    expect(mockPostService.findUserPosts).toHaveBeenCalledTimes(1);

    // Response.status가 200으로 정상 전달되었는가
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // Response.json이 {data: posts} 형태로 정상 전달 되었는가
    expect(mockResponse.json).toHaveBeenCalledWith({
      posts: findUserPostsReturnValue,
    });
  });

  test("Posts Controller getUserPosts Method by Failed", async () => {
    // 준비
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
      // 실행
      await postsController.getMainPage(mockRequest, mockResponse, next);
    } catch (e) {
      // 검증
      expect(e.statusCode).toHaveBeenCalledWith(400);
    }
  });

  test("Posts Controller createPost Method by Success", async () => {
    // 준비
    const createPostBodyParams = {
      title: "title1",
      content: "content1",
      tag: [
        "tag1"
      ]
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

    // 실행
    await postsController.createPost(mockRequest, mockResponse, next);

    // 검증
    // Request에 있는 body 데이터가 정상적으로 createPost에 전달되었는가
    expect(mockPostService.createPost).toHaveBeenCalledTimes(1);
    expect(mockPostService.createPost).toHaveBeenCalledWith(
      createPostLocalsUser.userId,
      createPostLocalsUser.nickname,
      createPostBodyParams.title,
      createPostBodyParams.content,
      createPostBodyParams.tag
    );

    // mockResponse.status는 201로 정상 전달되었는지 검증한다.
    expect(mockResponse.status).toHaveBeenCalledWith(201);
  });

  test("Posts Controller createPost Method by Failed", async () => {
    // 준비
    const createPostBodyParams = {
      title: "title1",
      content: "content1",
    };
    mockRequest.body = createPostBodyParams;

    mockPostService.createPost = jest.fn(() => {
      return createPostBodyParams;
    });

    try {
      // 실행
      await postsController.createPost(mockRequest, mockResponse, next);   
    } catch (e) {
      // 검증
      expect(e.statusCode).toHaveBeenCalledWith(400);
    }
  });

  test("Posts Controller getOnePost Method by Success", async () => {
    // 준비
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

    // 실행
    await postsController.getOnePost(mockRequest, mockResponse, next);

    // 검증
    // getOnePost 메서드가 한 번 호출되었는가
    expect(mockPostService.getOnePost).toHaveBeenCalledTimes(1);

    // Response.status가 200으로 정상 전달되었는가
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // Response.json이 {data: posts} 형태로 정상 전달 되었는가
    expect(mockResponse.json).toHaveBeenCalledWith({
      post: getOnePostReturnValue,
    });
  });

  test("Posts Controller getOnePost Method by Failed", async () => {
    // 준비
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
      // 실행
      await postsController.getOnePost(mockRequest, mockResponse, next);    
    } catch (e) {
      //검증
      expect(e.statusCode).toHaveBeenCalledWith(400);
    }
  });

  test('Posts Controller updatePost Method by Success', async () => {
    // 준비
    const updatePostBodyParams = {
        title: 'title1',
        content: 'content1',
        tag: [
          "tag1"
        ],
    };

    const getOnePostReturnValue = [
      {
        nickname: 'nickname1',
        title: 'title1',
        content: 'content1',
        prevPostId: 1,
        prevPostTitle: "title",
        nextPostId: 3,
        nextPostTitle: "title",
        postComment: []
      },
    ];

    mockRequest.body = updatePostBodyParams;
    mockRequest.params = {_postId: 1};
    mockResponse.locals.user = {nickname: 'test'};

    mockPostService.getOnePost = jest.fn(() => {
      return getOnePostReturnValue;
    });

    mockPostService.updatePost = jest.fn(() => {
      return updatePostBodyParams;
    });

    // 실행
    await postsController.updatePost(mockRequest, mockResponse, next);

    // 검증
    expect(mockPostService.updatePost).toHaveBeenCalledTimes(1);
    expect(mockPostService.updatePost).toHaveBeenCalledWith(
      mockRequest.params._postId,
      updatePostBodyParams.title,
      updatePostBodyParams.content,
      updatePostBodyParams.tag,
      mockResponse.locals.user.nickname
    );
  });

  test("Posts Controller updatePost Method by Failed", async () => {
    // 준비
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
      // 실행
      await postsController.updatePost(mockRequest, mockResponse, next);
    } catch (e) {
      // 검증
      expect(e.statusCode).toHaveBeenCalledWith(400);
    }
  });

  test('Posts Controller deletePost Method by Success', async () => {
    // 준비
    mockRequest.params = { postId: 1 };

    const getOnePostReturnValue = [
      {
        nickname: 'nickname1',
        title: 'title1',
        content: 'content1',
        prevPostId: 1,
        prevPostTitle: "title",
        nextPostId: 3,
        nextPostTitle: "title",
        postComment: []
      },
    ];

    mockPostService.getOnePost = jest.fn(() => {
      return getOnePostReturnValue;
    })
    mockPostService.deletePost = jest.fn(() => {
      return deletePostMessage;
    })

    // 실행
    await postsController.deletePost(mockRequest, mockResponse, next);

    // 검증
    expect(mockPostService.deletePost).toHaveBeenCalledTimes(1);

  });

  test("Posts Controller deletePost Method by Failed", async () => {
    // 준비
    mockPostService.deletePost = jest.fn(() => {});

    try {
      // 실행
      await postsController.deletePost(mockRequest, mockResponse, next);
    } catch (e) {
      // 검증
      expect(e.statusCode).toHaveBeenCalledWith(400);
    }
  });
});
