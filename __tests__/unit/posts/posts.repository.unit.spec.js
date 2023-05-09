const PostsRepository = require("./../../../repositories/posts.repository");
const { Op } = require("sequelize");

let mockPostsModel = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

let mockCommentsModel = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

const postsRepository = new PostsRepository(mockPostsModel, mockCommentsModel);

describe("[Posts Repository] Unit Test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // 전체 게시글 조회 (return value)
  test("findAllPosts method", async () => {
    const returnValue = [
      {
        postId: 1,
        UserId: 1,
        nickname: "nickname_1",
        title: "title_1",
        content: "content_1",
        likes: 10,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 2,
        UserId: 2,
        nickname: "nickname_2",
        title: "title_2",
        content: "content_2",
        likes: 10,
        status: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 3,
        UserId: 3,
        nickname: "nickname_3",
        title: "title_3",
        content: "content_3",
        likes: 10,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockPostsModel.findAll = jest.fn(() => {
      return returnValue.filter((ele) => ele.status === true);
    });

    const posts = await postsRepository.findAllPosts();

    // 한 번 호출 되었는지
    expect(postsRepository.model.findAll).toHaveBeenCalledTimes(1);

    // 매개변수가 잘 주어졌는지
    expect(postsRepository.model.findAll).toHaveBeenCalledWith({
      where: { status: true },
    });

    // 결과값이 적절한지
    expect(posts).toEqual([returnValue[0], returnValue[2]]);
  });

  // 특정 닉네임이 작성한 게시글 조회 (return value, parameter)
  test("findUsersPosts method", async () => {
    const returnValue = [
      {
        postId: 1,
        UserId: 1,
        nickname: "nickname_1",
        title: "title_1",
        content: "content_1",
        likes: 10,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 2,
        UserId: 1,
        nickname: "nickname_1",
        title: "title_2",
        content: "content_2",
        likes: 10,
        status: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 3,
        UserId: 2,
        nickname: "nickname_2",
        title: "title_3",
        content: "content_3",
        likes: 10,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const nickname = "nickname_1";

    mockPostsModel.findAll = jest.fn(() => {
      return returnValue.filter(
        (ele) => ele.status === true && ele.nickname === nickname
      );
    });

    const posts = await postsRepository.findUserPosts(nickname);

    // 한 번 호출 되었는지
    expect(postsRepository.model.findAll).toHaveBeenCalledTimes(1);

    // 매개변수가 잘 주어졌는지
    expect(postsRepository.model.findAll).toHaveBeenCalledWith({
      where: { nickname, status: true },
    });

    // 결과값이 적절한지
    expect(posts).toEqual([returnValue[0]]);
  });

  // 게시글 작성 (no return, just parameters)
  test("createPost method", async () => {
    const [userId, nickname, title, content] = [
      1,
      "nickname_1",
      "title_1",
      "content_1",
    ];

    mockPostsModel.create = jest.fn(() => {
      return;
    });

    await postsRepository.createPost(userId, nickname, title, content);

    expect(postsRepository.model.create).toHaveBeenCalledTimes(1);

    // 매개변수가 잘 주어졌는지
    expect(postsRepository.model.create).toHaveBeenCalledWith({
      UserId: userId,
      nickname,
      title,
      content,
    });
  });

  // 특정 게시글 조회 (return value, parameter)
  test("getOnePost method", async () => {
    const postId = 1;

    const commentObject = {
      commentId: 1,
      comment: "comment",
      nickname: "nickname",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const postObject = {
      postId: postId,
      UserId: 1,
      title: "title",
      content: "content",
      likes: 1,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      com: commentObject,
    };

    mockPostsModel.findOne = jest.fn(() => {
      return postObject.status === true ? postObject : null;
    });

    const post = await postsRepository.getOnePost(postId);

    expect(postsRepository.model.findOne).toHaveBeenCalledTimes(1);

    // TODO: comModel..
    expect(postsRepository.model.findOne).toHaveBeenCalledWith({
      where: { postId: postId, status: true },
      attributes: [
        "postId",
        "UserId",
        "nickname",
        "title",
        "content",
        "likes",
        "status",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: postsRepository.comModel,
          attributes: [
            "commentId",
            "comment",
            "nickname",
            "createdAt",
            "updatedAt",
          ],
        },
      ],
    });

    expect(post).toEqual({
      postId: postObject.postId,
      UserId: postObject.UserId,
      title: postObject.title,
      content: postObject.content,
      likes: postObject.likes,
      status: postObject.status,
      createdAt: postObject.createdAt,
      updatedAt: postObject.updatedAt,
      com: {
        commentId: postObject.com.commentId,
        comment: postObject.com.comment,
        nickname: postObject.com.nickname,
        createdAt: postObject.com.createdAt,
        updatedAt: postObject.com.updatedAt,
      },
    });
  });

  // 이전 게시글 조회 (return value, parameter)
  test("getPrevPost method", async () => {
    const postId = 2;

    const returnValue = [
      {
        postId: 1,
        UserId: 1,
        nickname: "nickname_1",
        title: "title_1",
        content: "content_1",
        likes: 10,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 3,
        UserId: 2,
        nickname: "nickname_2",
        title: "title_2",
        content: "content_2",
        likes: 10,
        status: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 2,
        UserId: 3,
        nickname: "nickname_3",
        title: "title_3",
        content: "content_3",
        likes: 10,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockPostsModel.findOne = jest.fn(() => {
      let result;

      returnValue.sort((a, b) => a.postId - b.postId);

      for (let i = 0; i < returnValue.length; i++) {
        if (returnValue[i].postId === postId) {
          result = returnValue[i - 1];
        }
      }

      return result;
    });

    const prevPost = await postsRepository.getPrevPost(postId);

    expect(postsRepository.model.findOne).toHaveBeenCalledTimes(1);

    expect(postsRepository.model.findOne).toHaveBeenCalledWith({
      where: {
        postId: {
          [Op.lt]: postId,
        },
        status: true,
      },
      order: [["postId", "DESC"]],
    });

    expect(prevPost).toEqual(returnValue[0]);
  });

  // 다음 게시글 조회 (return value, parameter)
  test("getNextPost method", async () => {
    const postId = 2;

    const returnValue = [
      {
        postId: 1,
        UserId: 1,
        nickname: "nickname_1",
        title: "title_1",
        content: "content_1",
        likes: 10,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 3,
        UserId: 2,
        nickname: "nickname_2",
        title: "title_2",
        content: "content_2",
        likes: 10,
        status: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 2,
        UserId: 3,
        nickname: "nickname_3",
        title: "title_3",
        content: "content_3",
        likes: 10,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockPostsModel.findOne = jest.fn(() => {
      let result;

      returnValue.sort((a, b) => a.postId - b.postId);

      for (let i = 0; i < returnValue.length; i++) {
        if (returnValue[i].postId === postId) {
          result = returnValue[i + 1];
        }
      }

      return result;
    });

    const nextPost = await postsRepository.getNextPost(postId);

    expect(postsRepository.model.findOne).toHaveBeenCalledTimes(1);

    expect(postsRepository.model.findOne).toHaveBeenCalledWith({
      where: {
        postId: {
          [Op.gt]: postId,
        },
        status: true,
      },
    });

    expect(nextPost).toEqual(returnValue[2]);
  });

  // 게시글 수정 (return value, parameter)
  test("updatePost method", async () => {
    const [postId, title, content] = [
      1,
      "title after update",
      "content update",
    ];

    const postBeforeUpdate = {
      postId: postId,
      UserId: 1,
      title: "title before update",
      content: "content before update",
      likes: 1,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPostsModel.update = jest.fn(() => {
      return {
        postId: postBeforeUpdate.postId,
        UserId: postBeforeUpdate.UserId,
        title: title,
        content: content,
        likes: postBeforeUpdate.likes,
        status: postBeforeUpdate.status,
        createdAt: postBeforeUpdate.createdAt,
        updatedAt: postBeforeUpdate.updatedAt,
      };
    });

    const postAfterUpdate = await postsRepository.updatePost(
      postId,
      title,
      content
    );

    expect(postsRepository.model.update).toHaveBeenCalledTimes(1);

    expect(postsRepository.model.update).toHaveBeenCalledWith(
      { title, content },
      { where: { postId: postId } }
    );

    expect(postAfterUpdate.title).toEqual(title);

    expect(postAfterUpdate.content).toEqual(content);
  });

  // 게시글 삭제 (return value, parameter)
  test("deletePost method", async () => {
    const [nickname, postId] = ["nickname", 1];

    const postBeforeDelete = {
      postId: postId,
      UserId: 1,
      nickname: nickname,
      title: "title",
      content: "content",
      likes: 1,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPostsModel.update = jest.fn(() => {
      return {
        postId: postBeforeDelete.postId,
        UserId: postBeforeDelete.UserId,
        title: postBeforeDelete.title,
        content: postBeforeDelete.content,
        likes: postBeforeDelete.likes,
        status: false,
        createdAt: postBeforeDelete.createdAt,
        updatedAt: postBeforeDelete.updatedAt,
      };
    });

    const postAfterDelete = await postsRepository.deletePost(nickname, postId);

    expect(postsRepository.model.update).toHaveBeenCalledTimes(1);

    expect(postsRepository.model.update).toHaveBeenCalledWith(
      { status: false },
      { where: { nickname, postId } }
    );

    expect(postAfterDelete.status).toEqual(false);
  });
});
