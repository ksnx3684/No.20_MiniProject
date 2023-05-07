const { Op } = require("sequelize");

class PostsRepository {
    constructor(model, comModel) {
        this.model = model;
        this.comModel = comModel;
    }

    findAllPosts = async () => {
        return await this.model.findAll({ where: { status: true } });
    };

    findUserPosts = async (nickname) => {
        return await this.model.findAll({ where: { nickname, status: true } });
    };

    createPost = async (userId, nickname, title, content) => {
        await this.model.create({ UserId: userId, nickname, title, content });
    };

    getOnePost = async (_postId) => {
        const post = await this.model.findOne({
            where: { postId: _postId, status: true },
            attributes: [
                "postId",
                "UserId",
                "title",
                "content",
                "likes",
                "status",
                "createdAt",
                "updatedAt",
            ],
            include: [
                {
                    model: this.comModel,
                    attributes: [
                        "commentId",
                        "comment",
                        "nickname",
                        "createdAt",
                        "updatedAt",
                    ],
                },
            ],
            where: {
                postId: _postId,
            },
        });
        console.log(post);
        return post;
    };

    getPrevPost = async (_postId) => {
        const post = await this.model.findOne({
            where: {
                postId: {
                    [Op.lt]: _postId,
                },
                status: true,
            },
            order: [["postId", "DESC"]],
        });
        return post;
    };

    getNextPost = async (_postId) => {
        const post = await this.model.findOne({
            where: {
                postId: {
                    [Op.gt]: _postId,
                },
                status: true,
            },
        });
        return post;
    };

    checkPost = async (_postId) => {
        const post = await this.model.findOne({
            where: { postId: _postId, status: true },
        });
        return post;
    };

    updatePost = async (_postId, title, content) => {
        const post = await this.model.update(
            { title, content },
            { where: { postId: _postId } }
        );
        return post;
    };

    deletePost = async (nickname, _postId) => {
        const post = await this.model.update(
            { status: false },
            { where: { nickname, postId: _postId } }
        );
        return post;
    };
}

module.exports = PostsRepository;
