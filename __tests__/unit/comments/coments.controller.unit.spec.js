const CommentsController = require("../../../controllers/comments.controller");
const errorWithCode = require("../../../utils/error");
let mockCommentsModel = {
    createComment: jest.fn(),
    updateComment: jest.fn(),
    deleteComment: jest.fn(),
};

let mockRequest = {
    body: jest.fn(),
    params: jest.fn(),
};

let mockResponse = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    locals: jest.fn(),
};
const next = jest.fn();

let commmentsController = new CommentsController();
commmentsController.commentsService = mockCommentsModel;

describe("Layered Architecture Pattern Comments Controller Unit Test", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    mockResponse.status = jest.fn(() => {
        return mockResponse;
    });

    test("createComments", async () => {
        //준비
        mockCommentsModel.createComment = jest.fn(() => {
            return "created";
        });
        const createRequestBody = {
            comment: "comment",
        };

        const resLocals = {
            nickname: "nickname",
            userId: 12,
        };
        const params = {
            _postId: 2,
        };
        mockRequest.body = createRequestBody;
        mockResponse.locals.user = resLocals;
        mockRequest.params = params;

        //CreateComment 테스트 실행부분
        const createComment = await commmentsController.createComment(
            mockRequest,
            mockResponse,
            next
        );

        // console.log(createComment);
        //검증
        expect(mockCommentsModel.createComment).toHaveBeenCalledTimes(1);
        expect(mockCommentsModel.createComment).toHaveBeenCalledWith(
            createRequestBody.comment,
            params._postId,
            resLocals.nickname,
            resLocals.userId
        );
        //  expect();
    });
    test("updateComment", async () => {
        //준비
        const updatedCRequestBody = {
            comment: "updated!",
        };
        const requestParams = {
            _postId: 1,
            _commentId: 1,
        };
        const resLocals = {
            nickname: "hawook",
        };

        mockRequest.body = updatedCRequestBody;
        mockRequest.params = requestParams;
        mockResponse.locals.user = resLocals;

        //실행
        await commmentsController.updateComment(
            mockRequest,
            mockResponse,
            next
        );

        //검증;
        expect(mockCommentsModel.updateComment).toHaveBeenCalledTimes(1);
        expect(mockCommentsModel.updateComment).toHaveBeenCalledWith(
            updatedCRequestBody.comment,
            requestParams._postId,
            resLocals.nickname,
            requestParams._commentId
        );
    });

    test("deleteComment", async () => {
        //준비
        mockCommentsModel.deleteComment = jest.fn(() => {
            return "deleted";
        });
        const requestParams = {
            _postId: 5,
            _commentId: 5,
        };
        const resLocals = {
            nickname: "hawook",
        };

        mockRequest.params = requestParams;
        mockResponse.locals.user = resLocals;

        //생성
        await commmentsController.deleteComment(
            mockRequest,
            mockResponse,
            next
        );

        expect(mockCommentsModel.deleteComment).toHaveBeenCalledTimes(1);
        expect(mockCommentsModel.deleteComment).toHaveBeenCalledWith(
            requestParams._commentId,
            resLocals.nickname,
            requestParams._postId
        );
    });

    test("delete 권한없음 어떤데", async () => {
        //설정
        mockCommentsModel.deleteComment = jest.fn(() => {
            return "success";
        });

        const requestParams = {
            _postId: 5,
            _commentId: 5,
        };
        const resLocals = {
            nickname: "hawook",
        };

        mockRequest.params = requestParams;
        mockResponse.locals.user = resLocals;

        //생성

        await commmentsController.deleteComment(
            mockRequest,
            mockResponse,
            next
        );

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith(true);

        expect(next).toHaveBeenCalledWith();
        expect(mockCommentsModel.deleteComment).toHaveBeenCalledTimes(1);
        //검증

        expect(next).toHaveBeenCalledTimes(1);
    });
});
