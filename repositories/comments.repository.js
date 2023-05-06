class CommentsRepository {
    constructor(commentsModel) {
        this.commentsModel = commentsModel;
    }

    allComments = async (_postId) => {
        const allComments = await this.commentsModel.findAll({
            where: { postId: _postId },
        });
        return allComments;
    };

    oneComment = async (_commentId) => {
        const oneComment = await this.commentsModel.findByPk(_commentId);
    };

    //가져온 닉네임 어케 처리할까1
    createComment = async (comment, _nickname, _postId, nickname, userId) => {
        const createComment = await this.commentsModel.create({
            comment,
            nickname: nickname,
            postId: _postId,
            userId: userId,
        });
    };

    updateComment = async (
        comment,
        //    _nickname,
        _postId,
        nickname,
        userId,
        _commentId
    ) => {
        const updateComment = await this.commentsModel.update(
            { comment },
            {
                where: { _commentId },
            }
        );
    };
    deleteComment = async (_nickname, _postId) => {
        const deleteComment = await this.commentsModel.destroy({
            where: {
                commentId: _commentId,
            },
        });
    };
}
module.exports = CommentsRepository;
