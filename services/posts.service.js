const PostRepository = require('../repositories/posts.repository');

class PostService {
    postRepository = new PostRepository();

    getOnePost = async (_nickname, _postId) => {
        const post = await this.postRepository.getOnePost(_nickname, _postId);
        return post;
    };

    getPrePost = async (_nickname, _postId) => {
        const post = await this.postRepository.getOnePost(_nickname, _postId);
        return post;
    };

    getNextPost = async (_nickname, _postId) => {
        const post = await this.postRepository.getOnePost(_nickname, _postId);
        return post;
    };

    checkPost = async (_postId) => {
        const post = await this.postRepository.checkPost(_postId);
        return post;
    };

    updatePost = async (_postId, title, content) => {
        const post = await this.postRepository.updatePost(_postId, title, content);
        return post;
    };

    deletePost = async (nickname, _postId) => {
        const post = await this.postRepository.deletePost(nickname, _postId);
        return post;
    };

}

module.exports = PostService;