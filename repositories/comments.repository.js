const { Op } = require("sequelize");

class CommentsRepository {
    constructor(commentsModel) {
        this.commentsModel = commentsModel;
    }

    allComments = async (_nickname, _postId) => {
        const allComments = await this.commentsModel.findAll({
            where: { postId: _postId },
        });
        return allComments;
    };

    oneComment = async (_commentId) => {
        const oneComment = await this.commentsModel.findOne({
            where: { commentId: _commentId },
        });
        return oneComment;
    };

    createComment = async (comment, _postId, nickname, userId) => {
        const createComment = await this.commentsModel.create({
            comment,
            nickname: nickname,
            PostId: _postId,
            UserId: userId,
        });
        return createComment;
    };

    updateComment = async (comment, _commentId, nickname) => {
        const updateComment = await this.commentsModel.update(
            { comment },
            {
                where: {
                    [Op.and]: [{ commentId: _commentId }, { nickname }],
                },
            }
        );
        return updateComment;
    };
    deleteComment = async (nickname, _commentId) => {
        const deletedComment = await this.commentsModel.destroy({
            where: {
                [Op.and]: [{ commentId: _commentId }, { nickname }],
            },
        });
        return deletedComment;
    };
}
module.exports = CommentsRepository;
