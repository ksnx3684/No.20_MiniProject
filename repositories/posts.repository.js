class PostsRepository {
  constructor(model) {
    this.model = model;
  }

  findAllPosts = async () => {
    return await this.model.findAll();
  };

  findUserPosts = async (nickname) => {
    return await this.model.findAll({ where: { nickname } });
  };

  createPost = async (userId, nickname, title, content) => {
    await this.model.create({ UserId: userId, nickname, title, content });
  };
}

module.exports = PostsRepository;
