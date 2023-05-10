const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware.js");
const UsersController = require("../controllers/users.controller.js");

const usersController = new UsersController();

// 닉네임 중복검사
router.post("/checkNickname", usersController.checkNickname);

// 회원가입
router.post("/signup", usersController.signup);

// 회원탈퇴
router.delete("/withdrawal", authMiddleware, usersController.withdrawal);

// 로그인
router.post("/login", usersController.login);

// 로그인 테스트
router.post("/login/test", authMiddleware, usersController.authMiddlewareTest);

// 로그아웃
router.post("/logout", authMiddleware, usersController.logout);

// 회원정보 조회
router.get("/profile", authMiddleware, usersController.getProfile);

// 회원정보 수정
router.put("/profile", authMiddleware, usersController.editProfile);

module.exports = router;
