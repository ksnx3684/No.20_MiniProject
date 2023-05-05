const { Users, UserInfo } = require("../models");

class UsersRepository {

  // 회원등록
  addUser = async ( nickname, password ) => {
    return await Users.create({ nickname, password });
  };

  // 회원찾기 with nickname
  getUserWithNickname = async ( nickname ) => {
    return await Users.findOne({ where: { nickname } });
  };
  
  // 회원찾기 with userId
  getUserWithUserId = async ( userId ) => {
    return await Users.findOne({ where: { userId } });
  };

  // 회원정보 등록
  addProfile = async ( userId, userImage, email, github, description ) => {
    return await UserInfo.create({ UserId:userId, userImage, email, github, description });
  };
  
  // 회원정보 조회
  getProfile = async ( userId ) => {
    return await UserInfo.findOne({
      attributes: [ "userImage", "email", "github", "description" ],
      where: { UserId:userId}
    });
  };

  // 회원정보 수정
  editProfile = async ( userId, userImage, email, github, description ) => {
    return await UserInfo.update(
      { userImage, email, github, description },
      { where: { UserId : userId }}
    );
  };
};

module.exports = UsersRepository;