const UsersRepository = require('../repositories/users.repository.js');
const JWT = require('jsonwebtoken');

class UsersService {
  usersRepository = new UsersRepository();

  // 회원찾기 (with nickname)
  getUserWithNickname = async (nickname) => {
    const getUser = await this.usersRepository.getUserWithNickname(nickname);
    return getUser;
  };

  // 회원가입
  signup = async (nickname, password) => {
    await this.usersRepository.addUser(nickname, password);
    return true;
  };

  // 로그인
  login = async (nickname, password) => {
    // Find Member's userId with nickname
    const getUser = await this.usersRepository.getUserWithNickname(nickname);
    // JWT create
    const token = JWT.sign({ userId: getUser.userId }, "customized_secret_key");
    return { token };
  };

  // 회원정보 등록
  addProfile = async (userId, userImage, email, github, description) => {
    await this.usersRepository.addProfile(userId, userImage, email, github, description);
    return true;
  };

  // 회원정보 조회
  getProfile = async (userId) => {
    return await this.usersRepository.getProfile(userId);
  };

  // 회원정보 수정
  editProfile = async (userId, userImage, email, github, description) => {
    return await this.usersRepository.editProfile(userId, userImage, email, github, description);
  };

  // 회원탈퇴
  withdrawal = async (userId) => {
    return await this.usersRepository.withdrawal(userId);
  };
};

module.exports = UsersService;