const PostService = require('../services/posts.service');

class PostsController {
    postService = new PostService();

    // 게시글 상세 조회
    getOnePost = async (req, res, next) => {
        try {
            const { _nickname, _postId } = req.params;
            const post = await this.postService.getOnePost(_nickname, _postId);

            if (!post)
                return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });

            const checkPost = await this.postService.checkPost(_postId);
            const prePost = await this.postService.getPrePost(_nickname, _postId);
            const nextPost = await this.postService.getNextPost(_nickname, _postId);
            
            return res.status(200).json({ post: post });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ errorMessage: '게시글 조회에 실패하였습니다.' });
        }
    }

    // 게시글 수정
    updatePost = async (req, res, next) => {
        try {
            const { _nickname, _postId } = req.params;
            const { title, content } = req.body;
            const { nickname } = res.locals.user;
            
            const post = await this.postService.checkPost(_postId);

            if(!post)
                return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
            
            if(post.nickname !== nickname)
                return res.status(403).json({ errorMessage: '게시글 수정 권한이 존재하지 않습니다.' });

            await this.postService.updatePost(_postId, title, content)
                .catch((err) => {
                    console.log(err);
                    return res.status(400).json({ errorMessage: '게시글 수정이 정상적으로 처리되지 않았습니다.' });
                });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ errorMessage: '게시글 수정에 실패하였습니다.' });
        }
        return res.status(200).json({ message: '게시글 수정에 성공하였습니다.' });
    }


    // 게시글 삭제
    deletePost = async (req, res, next) => {
        try {
            const { _nickname, _postId } = req.params;
            const { nickname } = res.locals.user;

            const post = await this.postService.checkPost(_postId);

            if (!post)
                return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });

            if (!nickname || post.nickname !== nickname)
                return res.status(403).json({ errorMessage: '게시글 삭제 권한이 존재하지 않습니다.' });

            await this.postService.deletePost(nickname, _postId)
                .catch((err) => {
                    console.log(err);
                    return res.status(400).json({ errorMessage: '게시글이 정상적으로 삭제되지 않았습니다.' });
                });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ errorMessage: '게시글 삭제에 실패하였습니다.' });
        }
        return res.status(200).json({ message: '게시글 삭제에 성공하였습니다.' });
    }

}

module.exports = PostsController;