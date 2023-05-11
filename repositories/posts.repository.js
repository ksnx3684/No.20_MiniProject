const { Op } = require("sequelize");
const { post } = require("superagent");

class PostsRepository {
  constructor(model, comModel, tagModel) {
    this.model = model;
    this.comModel = comModel;
    this.tagModel = tagModel;
  }

  findAllPosts = async () => {
    return await this.model.findAll({ where: { status: true } });
  };

  findUserPosts = async (nickname) => {
    return await this.model.findAll({ where: { nickname, status: true } });
  };

  createPost = async (userId, nickname, title, content) => {
    const post = await this.model.create({ UserId: userId, nickname, title, content });
    return post;
  };

  createTag = async (postId, tags) => {
    await this.tagModel.create({ postId: postId, tagName: tags })
  }

  getOnePost = async (_postId) => {
    return await this.model.findOne({
      where: { postId: _postId, status: true },
      attributes: [
        "postId",
        "UserId",
        "nickname",
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
        {
          model: this.tagModel,
          attributes: [
            "tagName",
          ],
        },
      ],
    });
  };

  getPrevPost = async (_postId) => {
    return await this.model.findOne({
      where: {
        postId: {
          [Op.lt]: _postId,
        },
        status: true,
      },
      order: [["postId", "DESC"]],
    });
  };

  getNextPost = async (_postId) => {
    return await this.model.findOne({
      where: {
        postId: {
          [Op.gt]: _postId,
        },
        status: true,
      },
    });
  };

  updatePost = async (_postId, title, content) => {
    return await this.model.update(
      { title, content },
      { where: { postId: _postId } }
    );
  };

  updateTag = async (_postId, tags) => {
    const post = await this.tagModel.update(
      { tagName: tags },
      { where: { postId: _postId } }
    );
    return post;
  };

  deletePost = async (nickname, _postId) => {
    return await this.model.update(
      { status: false },
      { where: { nickname, postId: _postId } }
    );
  };

}

module.exports = PostsRepository;
