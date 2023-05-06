const UsersRepository = require('../repositories/users.repository.js');
const JWT = require('jsonwebtoken');

class UsersService {
  usersRepository = new UsersRepository();

  // Find Member with nickname
  getUserWithNickname = async (nickname) => {
    try {
      const getUser = await this.usersRepository.getUserWithNickname(nickname);
      return getUser;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // 회원가입
  signup = async (nickname, password) => {
    try {
      await this.usersRepository.addUser(nickname, password);
      return true
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // 로그인
  login = async (nickname, password) => {
    try {
      // Find Member's userId with nickname
      const getUser = await this.usersRepository.getUserWithNickname(nickname);
      // JWT create
      const token = JWT.sign({ userId: getUser.userId }, "customized_secret_key");
      return { token }
    } catch (err) {
      console.error(err);
      return { errorMessage: "로그인에 실패하였습니다."};
    }
  };

  // 회원정보 등록
  addProfile = async (userId, userImage, email, github, description) => {
    try {
      await this.usersRepository.addProfile(userId, userImage, email, github, description);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    };
  };

  // 회원정보 조회
  getProfile = async (userId) => {
    return await this.usersRepository.getProfile(userId);
  };

  // 회원정보 수정
  editProfile = async (userId, userImage, email, github, description) => {
    return await this.usersRepository.editProfile(userId, userImage, email, github, description);
  };

  // 회원 탈퇴
  withdrawal = async (userId) => {
    return await this.usersRepository.withdrawal(userId);
  }

};

module.exports = UsersService;