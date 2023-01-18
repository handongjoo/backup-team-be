const express = require('express')
const router = express.Router()
const jwtVerify = require('../config/jwt_verify');
const userController = require('../controller/user.controller')


// 유저 목록 조회 (연습)
router.get("/users", userController.userList)
// 로그인 페이지
router.post('/login', userController.login)
//프로필(decode) + 내가 작성한 글(myArticles) 조회
router.get('/profile/:id', jwtVerify, userController.profileAndMyArticles);
// 유저 조회
router.get('/users/:id', userController.findUser);

module.exports = router