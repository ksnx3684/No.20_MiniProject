const { Comments, Posts } = require("../models");
const CommentsRepository = require("../repositories/comments.repository");
const PostsRepository = require("../repositories/posts.repository");

class CommentsService {
    postsRepository = new PostsRepository(Posts, Comments);
    commentsRepository = new CommentsRepository(Comments);

    allComments = async (_postId) => {
        const allComments = await this.commentsRepository.allComments(_postId);

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

    createComment = async (comment, _postId, nickname, userId) => {
        await this.commentsRepository.createComment(
            comment,
            _postId,
            nickname,
            userId
        );
    };

    updateComment = async (comment, _postId, nickname, _commentId) => {
        const check = await this.authorization(_commentId, nickname, _postId);

        if (check !== true) {
            throw errorWithCode(404, "댓글의 수정 권한이 존재하지 않습니다.");
        }

        await this.commentsRepository.updateComment(
            comment,
            _postId,
            _commentId,
            nickname
        );
    };

    deleteComment = async (_commentId, nickname, _postId) => {
        const check = await this.authorization(_commentId, nickname, _postId);
        if (check !== true) {
            throw errorWithCode(404, "댓글의 삭제 권한이 존재하지 않습니다.");
        }

        await this.commentsRepository.deleteComment(
            nickname,
            _commentId,
            _postId
        );
    };

    authorization = async (_commentId, nickname, _postId) => {
        const existPost = await this.postsRepository.getOnePost(_postId);
        if (!existPost) {
            throw errorWithCode(404, "게시글이 존재하지 않습니다");
        }

        const existComment = await this.commentsRepository.oneComment(
            _commentId
        );

        if (!existComment) {
            throw errorWithCode(404, "댓글이 존재하지 않습니다");
        }

        return existComment.nickname === nickname;
    };
}
module.exports = CommentsService;
