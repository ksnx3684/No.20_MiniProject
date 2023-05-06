const CommentsService = require("../services/comments.service");
const errorWithCode = require("../utils/error");
class CommentsController {
    commentsService = new CommentsService();

    allComments = async (req, res, next) => {
        try {
            const { _nickname, _postId } = req.params;

            const allComments = await this.commentsService.allComments(
                _nickname,
                _postId
            );
            return res
                .status(200)
                .json({ comments: allComments, result: true });
        } catch (err) {
            err.failedApi = "댓글조회";
            next(err);
        }
    };

    createComment = async (req, res, next) => {
        try {
            const { comment } = req.body;
            const { _nickname, _postId } = req.params;
            const { nickname, userId } = res.locals.user;

            const createComment = await this.commentsService.createComment(
                comment,
                _nickname,
                _postId,
                nickname,
                userId
            );

            return res.status(201).send(true);
        } catch (err) {
            err.failedApi = "댓글생성";
            next();
        }
    };

    updateComment = async (req, res, next) => {
        try {
            const { comment } = req.body;
            const { _nickname, _postId, _commentId } = req.params;
            const { nickname, userId } = res.locals.user;

            const updateComment = await this.commentsService.updateComment(
                comment,
                _nickname,
                _postId,
                nickname,
                userId,
                _commentId
            );
            return res.status(200).send(true);
        } catch (err) {
            err.failedApi = "댓글수정";
            next();
        }
    };

    deleteComment = async (req, res, next) => {
        try {
            const { _nickname, _postId, _commentId } = req.params;
            const { nickname, userId } = res.locals.user;

            const deleteComment = await this.commentsService.deleteComment(
                _nickname,
                _postId,
                _commentId,
                nickname,
                userId
            );
            return res.status(200).send(true);
        } catch (err) {
            err.failedApi = "댓글삭제";
            next();
        }
    };
}

module.exports = CommentsController;
//error try catch =controller
//boolean  true false //userId, nickname 둘다 가져오는걸로
//throw status/message  errorwithcode
