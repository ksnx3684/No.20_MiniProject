const UsersService = require("../services/users.service.js");
const errorWithCode = require("../utils/error.js");
const RedisClientRepository = require("../utils/redis-util.js");
const redisClientRepository = new RedisClientRepository();
const jwt = require("../utils/jwt-util.js");

class UsersController {
  usersService = new UsersService();

  // 닉네임 중복검사
  isNickname = async (req, res) => {
    // 1. 데이터 입력받기
    const { nickname } = req.body;
    // 2. 닉네임 중복 검사
    const getUser = await this.usersService.getUserWithNickname(nickname);
    if (getUser) {
      return res.status(200).end();
    } else {
      return res.status(412).send(false);
    }
  };

  // 회원가입
  signup = async (req, res, next) => {
    try {
      // 1. 데이터 입력받기
      const { nickname, password, userImage, email, github, description } =
        req.body;

      // 1. 예외처리
      // 1-1. 닉네임 중복 검사
      const getUser = await this.usersService.getUserWithNickname(nickname);
      if (getUser) {
        throw errorWithCode(412, "중복된 닉네임입니다.");
      }
      // 1-2. 닉네임 조건 검사 (알파벳 1글자 이상 필수, 알파벳 대소문자 & 숫자만 가능, 길이는 최소 6 <= x <= 12,)
      if (
        !/^(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(nickname) ||
        nickname.length < 6 ||
        nickname.length > 12
      ) {
        throw errorWithCode(412, "닉네임의 형식이 일치하지 않습니다.");
      }
      // 1-3. 패스워드에 닉네임 포함여부 검사
      if (password.includes(nickname)) {
        throw errorWithCode(412, "패스워드에 닉네임이 포함되어 있습니다.");
      }
      // 1-4. 패스워드 조건 검사 (최소 8글자 이상 가능)
      if (password.length <= 7) {
        throw errorWithCode(412, "패스워드 형식이 일치하지 않습니다.");
      }
      // 1-5. userImage 유효성 검사
      if (typeof userImage === "undefined") {
        throw errorWithCode(412, "프로필 이미지 형식이 일치하지 않습니다.");
      }
      // 1-6. email 유효성 검사
      if (typeof email === "undefined") {
        throw errorWithCode(412, "이메일 형식이 일치하지 않습니다.");
      }
      // 1-7. github 유효성 검사
      if (typeof github === "undefined") {
        throw errorWithCode(412, "깃허브 형식이 일치하지 않습니다.");
      }
      // 1-8. description 유효성 검사
      if (typeof description === "undefined") {
        throw errorWithCode(412, "소개글 형식이 일치하지 않습니다.");
      }

      // 2. Users 회원등록
      const signupResult = await this.usersService.signup(nickname, password);

      // 3. UserInfo 회원정보 등록
      // 3-1. Users.userId 가져오기
      const { userId } = await this.usersService.getUserWithNickname(nickname);
      // 3-2. UserInfo 회원정보 등록
      const addProfileResult = await this.usersService.addProfile(
        userId,
        userImage,
        email,
        github,
        description
      );

      if (signupResult && addProfileResult) {
        return res.status(200).end();
      }
    } catch (err) {
      err.failedApi = "회원가입";
      next(err);
    }
  };

  // 로그인 - JWT 기존 방식
  // login = async (req, res, next) => {
  //   try {
  //     // 1. 데이터 입력받기
  //     const { nickname, password } = req.body;
  //     // 2. 예외처리
  //     // 2-1. 회원찾기 (닉네임)
  //     const getUser = await this.usersService.getUserWithNickname(nickname);
  //     if (!getUser || getUser.password !== password) {
  //       throw errorWithCode(401, "닉네임 또는 패스워드를 확인해주세요.");
  //     }
  //     // 3. 로그인하기
  //     const token = await this.usersService.login(nickname, password);
  //     res.cookie("authorization", `Bearer ${token}`);
  //     return res.status(200).json({ token });
  //   } catch (err) {
  //     err.failedApi = "로그인";
  //     next(err);
  //   }
  // };

  login = async (req, res, next) => {
    try {
      const { nickname, password } = req.body;
      // 2. 예외처리
      // 2-1. 회원찾기 (닉네임)
      const getUser = await this.usersService.getUserWithNickname(nickname);
      if (!getUser || getUser.password !== password) {
        throw errorWithCode(401, "닉네임 또는 패스워드를 확인해주세요.");
      }
      // 토큰 생성
      const accesstoken = jwt.createaccesstoken(
        getUser.userId,
        getUser.nickname
      );
      const refreshtoken = jwt.createrefreshtoken();

      // redis 저장 준비
      const key = refreshtoken;
      const value = JSON.stringify({
        userId: getUser.userId,
        nickname: getUser.nickname,
      });

      // REDIS 저장 실행
      async function setData(key, value) {
        try {
          await redisClientRepository.setData(key, value).then(() => {
            console.log("Data saved successfully!");
          });
        } catch (err) {
          console.error(err);
        }
      }

      setData(key, value);

      // 쿠키 생성
      res.cookie("accesstoken", `Bearer ${accesstoken}`);
      res.cookie("refreshtoken", `Bearer ${refreshtoken}`);

      // 쿠키 생성 - (강의)
      // res.cookie("authorization", `Bearer ${token}`); // jwt 기본 방식

      return res.status(200).json({ accesstoken, refreshtoken });
    } catch (err) {
      console.error(err);
      return res.status(400).send(false);
    }
  };

  // 로그아웃
  logout = async (req, res, next) => {
    try {
      res.locals.user;
      res.clearCookie("authorization"); // 이 방식도 가능하고,
      // res.cookie('authorization', '', { maxAge: -1 }); // 이 방식도 가능
      return res.status(200).end();
    } catch (err) {
      err.failedApi = "로그아웃";
      next(err);
    }
  };

  // 회원정보 조회
  getProfile = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const getProfileData = await this.usersService.getProfile(userId);
      return res.status(200).json({ userInfo: getProfileData });
    } catch (err) {
      console.error(err);
      err.failedApi = "회원정보 조회";
      next(err);
    }
  };

  // 회원정보 수정
  editProfile = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { userImage, email, github, description } = req.body;
      // 1-1. userImage 유효성 검사
      if (typeof userImage === "undefined") {
        throw errorWithCode(412, "프로필 이미지 형식이 일치하지 않습니다.");
      }
      // 1-2. email 유효성 검사
      if (typeof email === "undefined") {
        throw errorWithCode(412, "이메일 형식이 일치하지 않습니다.");
      }
      // 1-3. github 유효성 검사
      if (typeof github === "undefined") {
        throw errorWithCode(412, "깃허브 형식이 일치하지 않습니다.");
      }
      // 1-4. description 유효성 검사
      if (typeof description === "undefined") {
        throw errorWithCode(412, "소개글 형식이 일치하지 않습니다.");
      }
      await this.usersService.editProfile(
        userId,
        userImage,
        email,
        github,
        description
      );
      return res.status(200).end();
    } catch (err) {
      console.error(err);
      err.failedApi = "회원정보 수정";
      next(err);
    }
  };

  // 회원 탈퇴
  withdrawal = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      await this.usersService.withdrawal(userId);
      return res.status(200).end();
    } catch (err) {
      err.failedApi = "회원 탈퇴";
      next(err);
    }
  };

  // 로그인 검증 - 테스트용
  authMiddlewareTest = async (req, res, next) => {
    try {
      const { userId, nickname } = res.locals.user;
      return res.status(200).json({ userId, nickname });
    } catch (err) {
      err.failedApi = "로그인";
      next(err);
    }
  };
}

module.exports = UsersController;
