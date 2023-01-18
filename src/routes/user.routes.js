const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken");
const jwtConfig = require('../config/configuration');
const jwtVerify = require('../config/jwt_verify');
const {getUserByEmailAndPassword, getUser, getMyProfile, getUsers} = require('../repository')


// 유저 목록 조회 (연습)
router.get("/users", async (req, res) => {
    const page = req.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
  
    const userInfo = await getUsers(limit, offset)
  
    res.send({ userInfo, currentPage: page });
  });

// 로그인 페이지
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await getUserByEmailAndPassword(email, password)
        if (!user) {
            res.status(400).send({message: "Not Found"})
            return
        } 
        const token = jwt.sign({userId : user.email}, jwtConfig.secretKey, jwtConfig.options);
        return res.cookie("user",token),
    
        res.status(200).json({message: "로그인 성공"})

    } catch (error) {
        res.status(500).send({message: error.message})
    }
})

// 유저 정보 확인
router.get('/users', jwtVerify, (req, res) => {
    try{
        const {user} = req.cookies;
        const token = jwt.verify(user, jwtConfig.secretKey)
        if (token) {
            return res.send(token)
        }
    } catch {
        res.send("로그인 후 사용 가능합니다.")
    }
});

//프로필 + 내가 작성한 글 조회
router.get('/profile/:id', jwtVerify, async (req, res) => {
    try{
        const user = req.cookies.user;
        const decoded = jwt.decode(user, jwtConfig.secretKey);
        const user_id = decoded.userId
        // article의 user_id와 user DB의 id값이 같은 article을 모두 가져와라
        const myArticles = await getMyProfile({id: user_id})
        // const userArticles = Articles.filter(article => article.user_id === user_id)

        if (myArticles) {
            res.status(200).json({decoded, myArticles})
        }
    }
    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
});

// 유저 조회
router.get('/users/:id', async (req,res) => {
    try{
        const {id} = req.params
        const user = await getUser(id)
            if (!user) {
                res.status(400).json({message: "사용자가 없습니다."})
                return
            }
            return res.status(200).send(results)
        }    
    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
});

module.exports = router