const redis = require("redis");

const jwt = require("../utils/jwt-util.js");
const { Users, UserInfo } = require("../models");
const UsersRepository = require("../repositories/users.repository.js");
const RedisClientRepository = require("../repositories/redis.repository.js");

class UsersService {
  usersRepository = new UsersRepository(Users, UserInfo);
  redisClientRepository = new RedisClientRepository(redis);

  // 회원찾기 (with nickname)
  getUserWithNickname = async (nickname) => {
    const user = await this.usersRepository.getUserWithNickname(nickname);
    return user;
  };

  // 회원가입
  signup = async (nickname, password) => {
    await this.usersRepository.addUser(nickname, password);
  };

  // 로그인
  login = async (user) => {
    // 토큰 생성
    const accesstoken = jwt.createAccessToken(user.userId, user.nickname);
    const refreshtoken = jwt.createRefreshToken();

    // redis 저장 준비
    const key = refreshtoken;
    const value = JSON.stringify({
      userId: user.userId,
      nickname: user.nickname,
    });

    // REDIS 저장 실행
    // await this.redisClientRepository.setData(key, value);
    const EXPIRE_TIME = 1209600; // 14일로 셋팅
    await this.redisClientRepository.setData(key, value, EXPIRE_TIME);
    return [accesstoken, refreshtoken];
  };

  // 회원정보 등록
  addProfile = async (userId, userImage, email, github, description) => {
    await this.usersRepository.addProfile(
      userId,
      userImage,
      email,
      github,
      description
    );
  };

  // 회원정보 조회
  getProfile = async (userId) => {
    return await this.usersRepository.getProfile(userId);
  };

  // 회원정보 수정
  editProfile = async (userId, userImage, email, github, description) => {
    return await this.usersRepository.editProfile(
      userId,
      userImage,
      email,
      github,
      description
    );
  };

  // 회원탈퇴
  withdrawal = async (userId) => {
    return await this.usersRepository.withdrawal(userId);
  };
}

module.exports = UsersService;
