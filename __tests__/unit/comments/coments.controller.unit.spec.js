const CommentsController = require("../../../controllers/comments.controller");

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
    status: jest.fn(),
    send: jest.fn(),
    locals: {},
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
        const createComment = await commmentsController.createComment(
            mockRequest,
            mockResponse,
            next
        );

        console.log(createComment);
        expect(mockCommentsModel.createComment).toHaveBeenCalledTimes(1);
        expect(mockCommentsModel.createComment).toHaveBeenCalledWith(
            createRequestBody.comment,
            params._postId,
            resLocals.nickname,
            resLocals.userId
        );
        expect();
    });
    test("updateComment", async () => {
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

        await commmentsController.updateComment(
            mockRequest,
            mockResponse,
            next
        );

        expect(mockCommentsModel.updateComment).toHaveBeenCalledTimes(1);
        expect(mockCommentsModel.updateComment).toHaveBeenCalledWith(
            updatedCRequestBody.comment,
            requestParams._postId,
            resLocals.nickname,
            requestParams._commentId
        );
    });
});
