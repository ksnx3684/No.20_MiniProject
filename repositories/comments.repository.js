const { Op } = require("sequelize");

class CommentsRepository {
    constructor(commentsModel) {
        this.commentsModel = commentsModel;
    }

    allComments = async (_postId) => {
        return await this.commentsModel.findAll({
            where: { postId: _postId },
        });
    };

    oneComment = async (_commentId) => {
        return await this.commentsModel.findOne({
            where: { commentId: _commentId },
        });
    };

    createComment = async (comment, _postId, nickname, userId) => {
        return await this.commentsModel.create({
            comment,
            nickname: nickname,
            PostId: _postId,
            UserId: userId,
        });
    };

    updateComment = async (comment, _commentId, nickname) => {
        return await this.commentsModel.update(
            { comment },
            {
                where: {
                    [Op.and]: [{ commentId: _commentId }, { nickname }],
                },
            }
        );
    };
    deleteComment = async (nickname, _commentId) => {
        return await this.commentsModel.destroy({
            where: {
                [Op.and]: [{ commentId: _commentId }, { nickname }],
            },
        });
    };
}
module.exports = CommentsRepository;
