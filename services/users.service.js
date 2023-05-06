const UsersRepository = require("../repositories/users.repository.js");
const JWT = require("jsonwebtoken");
const { Users, UserInfo } = require("../models");

class UsersService {
  usersRepository = new UsersRepository(Users, UserInfo);

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

  // Join in
  signup = async (nickname, password) => {
    try {
      await this.usersRepository.addUser(nickname, password);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  addProfile = async (userId, userImage, email, github, description) => {
    try {
      await this.usersRepository.addProfile(
        userId,
        userImage,
        email,
        github,
        description
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // log in
  login = async (nickname, password) => {
    try {
      // Find Member's userId with nickname
      const getUser = await this.usersRepository.getUserWithNickname(nickname);
      // JWT create
      const token = JWT.sign(
        { userId: getUser.userId },
        "customized_secret_key"
      );
      return { token };
    } catch (err) {
      console.error(err);
      return { errorMessage: "로그인에 실패하였습니다." };
    }
  };
}

module.exports = UsersService;
