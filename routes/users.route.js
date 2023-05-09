const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware.js");
const UsersController = require("../controllers/users.controller.js");
const usersController = new UsersController();

router.post("/isNickname", usersController.isNickname); // 닉네임 중복검사
router.post("/signup", usersController.signup); // 회원가입
router.delete("/withdrawal", authMiddleware, usersController.withdrawal); // 회원탈퇴
router.post("/login", usersController.login); // 로그인
router.post("/logout", authMiddleware, usersController.logout); // 로그아웃
router.get("/profile", authMiddleware, usersController.getProfile); // 회원정보 조회
router.put("/profile", authMiddleware, usersController.editProfile); // 회원정보 수정

module.exports = router;
