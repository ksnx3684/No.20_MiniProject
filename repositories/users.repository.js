class UsersRepository {
  constructor(users, userInfo) {
    this.usersModel = users;
    this.userInfoModel = userInfo;
  }
  // 회원등록
  addUser = async (nickname, password) => {
    return await this.usersModel.create({ nickname, password });
  };

  // 회원찾기 with nickname
  getUserWithNickname = async (nickname) => {
    return await this.usersModel.findOne({ where: { nickname } });
  };

  // 회원정보 등록
  addProfile = async (userId, userImage, email, github, description) => {
    return await this.userInfoModel.create({
      UserId: userId,
      userImage,
      email,
      github,
      description,
    });
  };

  // 회원정보 조회
  getProfile = async (userId) => {
    return await this.userInfoModel.findOne({
      attributes: ["userImage", "email", "github", "description"],
      where: { UserId: userId },
    });
  };

  // 회원정보 수정
  editProfile = async (userId, userImage, email, github, description) => {
    return await this.userInfoModel.update(
      { userImage, email, github, description },
      { where: { UserId: userId } }
    );
  };
  // 회원 탈퇴
  withdrawal = async (userId) => {
    await this.usersModel.destroy({ where: { userId } });
  };
}

module.exports = UsersRepository;
