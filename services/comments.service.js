const CommentsRepository = require("../repositories/comments.repository");
const { Comments, Posts } = require("../models");
const PostsRepository = require("../repositories/posts.repository");
class CommentsService {
    postsRepository = new PostsRepository(Posts);
    commentsRepository = new CommentsRepository(Comments);

    allComments = async (_nickname, _postId) => {
        const allComments = await commentsRepository.allComments(
            _nickname,
            _postId
        );

        allComments.sort((a, b) => b.createdAt - a.createdAt);

        return allComments.map((comment) => {
            return {
                commentId: comment.commentId,
                nickname: comment.nickname,
                comment: comment.comment,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
            };
        });
    };
    //가져온 닉네임 어케 처리할까1
    createComment = async (comment, _nickname, _postId, nickname, userId) => {
        const createComment = await this.commentsRepository.createComment(
            comment,
            _nickname,
            _postId,
            nickname,
            userId
        );
    };

    updateComment = async (
        comment,
        _nickname,
        _postId,
        nickname,
        userId,
        _commentId
    ) => {
        const check = await this.authorization(_commentId, nickname, _postId);
        if (check !== true)
            throw errorWithCode(404, "댓글의 수정 권한이 존재하지 않습니다.");

        const updateComment = await this.commentsRepository.updateComment(
            comment,
            //    _nickname,
            _postId,
            nickname,
            userId,
            _commentId
        );
    };
    deleteComment = async (
        _nickname,
        _postId,
        _commentId,
        nickname,
        userId
    ) => {
        const check = await this.authorization(_commentId, nickname);
        if (check !== true)
            throw errorWithCode(404, "댓글의 삭제 권한이 존재하지 않습니다.");

        const deleteComment = await this.commentsRepository.deleteComment(
            _commentId
        );
    };

    authorization = async (_commentId, nickname, _postId) => {
        const existPost = await this.postRepository.checkPost(_postId);
        if (!existPost) throw errorWithCode(404, "게시글이 존재하지 않습니다");
        const existComment = await this.commentsRepository.oneComment(
            _commentId
        );
        if (!existComment) throw errorWithCode(404, "댓글이 존재하지 않습니다");

        return existComment.nickname === nickname;
    };
}
module.exports = CommentsService;
