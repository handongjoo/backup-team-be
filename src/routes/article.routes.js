const express = require('express')
const router = express.Router()
const jwtVerify = require('../config/jwt_verify');
const articleController = require('../controller/article.controller')


// 홈페이지 + 모든 게시글 조회
router.get('/home', articleController.homePageArticles );
// 게시글 작성
router.post('/articles', jwtVerify, articleController.postArticle );
// 게시글 상세 조회
router.get('/articles/:id', articleController.detailArticle);
//게시글 수정
router.post('/articles/:id', jwtVerify, articleController.editArticle);
// 게시글 삭제
router.delete('/articles/:id', jwtVerify, articleController.destroyArticle)

module.exports = router