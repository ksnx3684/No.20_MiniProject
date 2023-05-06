class UsersRepository {
  constructor(users, userInfo) {
    this.usersModel = users;
    this.userInfoModel = userInfo;
  }
  // Add Member
  addUser = async (nickname, password) => {
    return await this.usersModel.create({ nickname, password });
  };

  addProfile = async (userId, userImage, email, github, description) => {
    return await this.userInfoModel.create({
      UserId: userId,
      userImage,
      email,
      github,
      description,
    });
  };

  // Find Member with nickname
  getUserWithNickname = async (nickname) => {
    return await this.usersModel.findOne({ where: { nickname } });
  };

  // Find Member with userId
  getUserWithUserId = async (userId) => {
    return await this.usersModel.findOne({ where: { userId } });
  };
}

module.exports = UsersRepository;
