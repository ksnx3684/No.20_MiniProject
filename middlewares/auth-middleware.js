const redis = require("redis");

const RedisClientRepository = require("../repositories/redis.repository.js");
const jwt = require("../utils/jwt-util.js");

const redisClientRepository = new RedisClientRepository(redis);

// 사용자 인증 미들웨어 - Redis 방식
module.exports = async (req, res, next) => {
  // 쿠키에 있는 토큰 가져오기
  const { accessToken, refreshToken } = req.cookies;

  // console.log(req.headers);

  // accessToken, refreshToken 존재 유무를 체크 : (falsy) 토큰이 존재하지 않습니다.
  const isAccessToken = accessToken ? true : false;
  const isRefreshToken = refreshToken ? true : false;

  // console.log(
  //   `isAccessToken: ${isAccessToken}, isRefreshToken: ${isRefreshToken}`
  // );

  if (!isAccessToken || !isRefreshToken) {
    return res
      .status(419)
      .json({ ok: false, message: "쿠키에 토큰 없음, 재로그인 필요" });
  }

  // accessToken, refreshToken 토큰 타입, 토큰 값 분할 할당
  const [accessTokenType, accessTokenValue] = accessToken.split(" ");
  const [refreshTokenType, refreshTokenValue] = refreshToken.split(" ");

  // console.log(
  //   `accessTokenType: ${accessTokenType}, refreshTokenType: ${refreshTokenType}`
  // );

  // accessToken, refreshToken 토큰 타입 확인 : (falsy) 타입이 정상적이지 않습니다.
  const isAccessTokenType = jwt.validateTokenType(accessTokenType);
  const isRefreshTokenType = jwt.validateTokenType(refreshTokenType);

  // console.log(
  //   `isAccessTokenType: ${isAccessTokenType}, isRefreshTokenType: ${isRefreshTokenType}`
  // );

  if (!isAccessTokenType || !isRefreshTokenType) {
    return res
      .status(419)
      .json({ ok: false, message: "타입 불량, 재로그인 필요" });
  }

  try {
    // 토큰 값 JWT 검증 : (falsy) 토큰이 만료되었습니다.
    const isAccessTokenValue = jwt.validateTokenValue(accessTokenValue);
    const isRefreshTokenValue = jwt.validateTokenValue(refreshTokenValue);

    // console.log(
    //   `isAccessTokenValue: ${isAccessTokenValue}, isRefreshTokenValue: ${isRefreshTokenValue}`
    // );

    if (!isRefreshTokenValue) {
      return res
        .status(419)
        .json({ ok: false, message: "Refresh 토큰 만료, 재로그인 필요" });
    }

    if (!isAccessTokenValue) {
      // redis refreshToken 로드 실행
      async function getData(refreshTokenValue) {
        try {
          const data = await redisClientRepository.getData(refreshTokenValue);
          if (data) {
            const { userId, nickname } = JSON.parse(data);
            if (userId.length < 0 && !nickname.length < 0) {
              // return Promise.reject({
              //   errorMessage:
              //     "Refresh Token의 정보가 서버에 존재하지 않습니다.",
              // });
              return res.status(419).json({
                ok: false,
                message: "Refresh 서버에 없음, 재로그인 필요",
              });
            } else {
              return Promise.resolve({ userId, nickname });
            }
          } else {
            return res.status(419).json({
              ok: false,
              message: "Refresh 서버에 없음, 재로그인 필요",
            });
          }
        } catch (e) {
          return res.status(419).json({
            ok: false,
            message: "Refresh 서버에 없음, 재로그인 필요",
          });
        }
      }

      const { userId, nickname } = await getData(refreshTokenValue);

      // Access Token 새발급
      const newAccessToken = jwt.createAccessToken(userId, nickname);

      // console.log("Access Token을 새롭게 발급하였습니다.");

      res.locals.user = jwt.getAccessTokenPayload(newAccessToken);
      res.cookie("accessToken", `Bearer ${newAccessToken}`);
      res
        .status(200)
        .json({ accessToken: newAccessToken, refreshToken: refreshTokenValue });
    }
    res.locals.user = jwt.getAccessTokenPayload(accessTokenValue);
    next();
  } catch (e) {
    console.log(e);
    return res
      .status(401)
      .json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
  }
};

// 사용자 인증 미들웨어 - JWT 기존 방식
/* 
// const jwt = require("jsonwebtoken");
const { Users } = require("../models");
module.exports = async (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization) {
    // authorization header is missing
    return res.status(401).json({ message: "로그인이 필요한 기능입니다." });
  }

  const [tokenType, token] = authorization.split(" ");

  if (tokenType !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ errorMessage: "로그인이 필요한 기능입니다." });
  }

  try {
    const decodedToken = jwt.verify(token, "customized_secret_key");
    const userId = decodedToken.userId;
    const user = await Users.findOne({ where: { userId } });
    if (!user) {
      return res.status(401).json({ errorMessage: "로그인에 실패하였습니다." });
    }
    res.locals.user = user;
    next();
  } catch (e) {
    return res
      .status(401)
      .json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
  }
};
 */
