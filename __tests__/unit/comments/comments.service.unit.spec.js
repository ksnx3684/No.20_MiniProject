const PostsRepository = require("../../../repositories/posts.repository");
const CommentService = require("../../../services/comments.service");
const errorWithCode = require("../../../utils/error");
let mockCommentsRepository = {
  allComments: jest.fn(),
  createComment: jest.fn(),
  updateComment: jest.fn(),
  deleteComment: jest.fn(),
};

let mockPostsRepository = {
  checkPost: jest.fn(),
};
let mockCommentService = {
  authorization: jest.fn(),
};
let commentService = new CommentService();
let postsRepository = new PostsRepository(
  mockPostsRepository,
  mockCommentsRepository
);
// commentService Repository를 Mock Repository로 변경합니다.
commentService.commentsRepository = mockCommentsRepository;

describe("Layered Architecture Pattern Posts Service Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("allComments Method", async () => {
    // allComments Method를 실행했을 때, Return 값 입니다.
    const allCommentsReturnValue = [
      {
        commentId: 1,
        nickname: "hawook",
        comment: "comment",
        createdAt: "date",
        updatedAt: "date",
      },
      {
        commentId: 1,
        nickname: "hawook",
        comment: "comment",
        createdAt: "date",
        updatedAt: "date",
      },
    ];

    // Repository의 allComments Method를 Mocking하고, allCommentsReturnValue Return 값으로 변경합니다.
    mockCommentsRepository.allComments = jest.fn(() => {
      return allCommentsReturnValue;
    });

    // commentService allComments Method를 실행합니다.
    const allComments = await commentService.allComments();

    // allComments 값이 commentRepository의 allComments Method 결과값을 내림차순으로 정렬한 것이 맞는지 검증합니다.
    expect(allComments).toEqual(
      allCommentsReturnValue.sort((a, b) => b.createdAt - a.createdAt)
    );

    // commentRepository의 allComments Method는 1번 호출되었는지 검증합니다.
    expect(mockCommentsRepository.allComments).toHaveBeenCalledTimes(1);
  });

  test("deleteComment", async () => {
    // commentRepository의 deleteComment Method Return 값을 설정하는 변수입니다.
    const deleteComment = {
      nickname: "hawook",
      _commentId: 1,
      _postId: 3,
    };
    mockCommentsRepository.deleteComment = jest.fn(() => {
      return "success";
    });
    // Mock Comment Repository의 findPostById Method의 Return 값을 findPostByIdReturnValue 변수로 변경합니다.
    commentService.authorization = jest.fn(() => {
      return true;
    });
    const deletedComment = await commentService.deleteComment(
      deleteComment._commentId,
      deleteComment.nickname,
      deleteComment._postId
    );

    // await mockCommentsRepository.deleteComment(
    //     deleteComment.nickname,
    //     deleteComment._commentId
    // );

    expect(mockCommentsRepository.deleteComment).toHaveBeenCalledTimes(1);

    expect(deletedComment).toBe("success");

    expect(mockCommentsRepository.deleteComment).toHaveBeenCalledWith(
      deleteComment.nickname,
      deleteComment._commentId
    );
  });

  test("deleteComment Method found Error", async () => {
    const deleteComment = {
      nickname: "hawook",
      _commentId: 1,
      _postId: 3,
    };

    commentService.authorization = jest.fn(() => {
      return false;
    });

    try {
      const deleteComments = await commentService.deleteComment(
        deleteComment._commentId,
        deleteComment.nickname,
        deleteComment._postId
      );

      console.log("should not work");
    } catch (e) {
      expect(commentService.authorization).toHaveBeenCalledTimes(1);
      console.log(e);
    }
  });
});
