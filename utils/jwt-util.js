const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY; // env에서 SECRET_KEY 불러오기
const ACCESS_TOKEN_EXPIRE_TIME = "10h"; // accesstoken 소멸시간 설정
const REFRESH_TOKEN_EXPIRE_TIME = "14d"; // refreshtoken 소멸시간 설정

module.exports = {
  // Access Token 발급
  createaccesstoken: (userId, nickname) => {
    const accesstoken = jwt.sign({ userId, nickname }, SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
    });
    return accesstoken;
  },
  // Refresh Token 발급
  createrefreshtoken: () => {
    const refreshtoken = jwt.sign({}, SECRET_KEY, {
      expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
    });
    return refreshtoken;
  },
  // Token Type 검증
  validateTokenType: (tokenType) => {
    try {
      return tokenType === "Bearer" ? true : false;
    } catch (error) {
      return false;
    }
  },
  // Token Value 검증 : verify는 검증실패 시, 에러를 발생시킴
  validateTokenValue: (tokenValue) => {
    try {
      jwt.verify(tokenValue, SECRET_KEY); // JWT를 검증합니다.
      return true;
    } catch (err) {
      return false;
    }
  },
  // Access Token > Payload 가져오기
  getaccesstokenPayload: (accesstokenValue) => {
    try {
      // JWT에서 Payload를 가져옵니다.
      if (jwt.verify(accesstokenValue, SECRET_KEY))
        return jwt.decode(accesstokenValue);
    } catch (error) {
      return null;
    }
  },
};
