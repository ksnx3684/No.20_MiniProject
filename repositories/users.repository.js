const { Users, UserInfo } = require("../models");

class UsersRepository {

  // Add Member
  addUser = async ( nickname, password ) => {
    return await Users.create({ nickname, password });
  };

  addProfile = async ( userId, userImage, email, github, description ) => {
    return await UserInfo.create({ UserId:userId, userImage, email, github, description });
  };

  // Find Member with nickname
  getUserWithNickname = async ( nickname ) => {
    return await Users.findOne({ where: { nickname } });
  };

  // Find Member with userId
  getUserWithUserId = async ( userId ) => {
    return await Users.findOne({ where: { userId } });
  }
};

module.exports = UsersRepository;