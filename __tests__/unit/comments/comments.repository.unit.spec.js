const CommentsRepository = require("../../../repositories/comments.repository");
const { Op } = require("sequelize");
// CommentsRepository 에서는 아래 5개의 Method만을 사용합니다.
let mockCommentsModel = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
};

let commentRepository = new CommentsRepository(mockCommentsModel);

describe("Layered Architecture Pattern Comments Repository Unit Test", () => {
    // 각 test가 실행되기 전에 실행됩니다.
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    });

    test("allComments test", async () => {
        // findAll Mock의 Return 값을 "findAll String"으로 설정합니다.
        mockCommentsModel.findAll = jest.fn(() => {
            return "findAll";
        });

        // commentsRepository의 allComments Method를 호출합니다.
        const allComments = await commentRepository.allComments();
        console.log(allComments);
        // commentsModel findAll은 1번만 호출 되었습니다.
        expect(commentRepository.commentsModel.findAll).toHaveBeenCalledTimes(
            1
        );

        // mockCommentsModel Return과 출력된 findAll Method의 값이 일치하는지 비교합니다.
        expect(allComments).toBe("findAll");
    });

    test("oneComment test", async () => {
        // findOne Mock의 Return 값을 "findOne String"으로 설정합니다.
        mockCommentsModel.findOne = jest.fn(() => {
            return "oneComment";
        });

        const oneComment = await commentRepository.oneComment();
        expect(commentRepository.commentsModel.findOne).toHaveBeenCalledTimes(
            1
        );
        expect(oneComment).toBe("oneComment");
    });

    test("createComment", async () => {
        // create Mock의 Return 값을 "findAll String"으로 설정합니다.
        mockCommentsModel.create = jest.fn(() => {
            return "create Return String";
        });

        // createComment Method를 실행하기 위해 필요한 Params 입니다.
        const createCommentParams = {
            comment: "createComment",
            nickname: "createNickname",
            PostId: "createPostId",
            UserId: "createUserId",
        };

        // commentRepository createComment Method를 실행합니다.
        const createComment = await commentRepository.createComment(
            createCommentParams.comment,
            createCommentParams.PostId,
            createCommentParams.nickname,
            createCommentParams.UserId
        );

        expect(createComment).toBe("create Return String");
        // commentRepository createComment Method를 실행했을 때, mockCommentsModel create를 1번 실행합니다.
        expect(mockCommentsModel.create).toHaveBeenCalledTimes(1);

        // commentRepository createComment Method를 실행했을 때, mockCommentsModel create를 아래와 같은 값으로 호출합니다.
        expect(mockCommentsModel.create).toHaveBeenCalledWith({
            comment: createCommentParams.comment,
            UserId: createCommentParams.UserId,
            PostId: createCommentParams.PostId,
            nickname: createCommentParams.nickname,
        });
    });

    test("updateComment test", async () => {
        // update Mock의 Return 값을 "findAll String"으로 설정합니다.
        mockCommentsModel.update = jest.fn(() => {
            return "return updated";
        });

        // updateComment Method를 실행하기 위해 필요한 Params 입니다.
        const updateCommentParams = {
            comment: "updateComment",
            _commentId: "CommentId",
            nickname: "nickname",
        };

        // commentRepository updateComment Method를 실행합니다.

        const updated = await commentRepository.updateComment(
            updateCommentParams.comment,
            updateCommentParams._commentId,
            updateCommentParams.nickname
        );

        expect(updated).toBe("return updated");

        expect(mockCommentsModel.update).toHaveBeenCalledTimes(1);
        // commentRepository updateComment Method를 실행했을 때, mockCommentsModel update 아래와 같은 값으로 호출합니다.
        expect(mockCommentsModel.update).toHaveBeenCalledWith(
            { comment: updateCommentParams.comment },
            {
                where: {
                    [Op.and]: [
                        { commentId: updateCommentParams._commentId },
                        { nickname: updateCommentParams.nickname },
                    ],
                },
            }
        );
    });
});
