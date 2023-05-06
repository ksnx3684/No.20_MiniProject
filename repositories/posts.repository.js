const { Op } = require("sequelize");
const { Posts } = require("../models");

class PostsRepository {
  constructor(model) {
    this.model = model;
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
    const post = await Posts.findOne({
      where: { postId: _postId },
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
    });
    return post;
  };

  checkPost = async (_postId) => {
    const post = await Posts.findOne({
      where: { postId: _postId },
    });
    return post;
  };

  updatePost = async (_postId, title, content) => {
    const post = await Posts.update(
      { title, content },
      { where: { postId: _postId } }
    );
    return post;
  };

  deletePost = async (_postId, nickname) => {
    const post = await Posts.destroy({
      where: {
        [Op.and]: [{ postId: _postId }, { nickname }],
      },
    });
    return post;
  };
}

module.exports = PostsRepository;
