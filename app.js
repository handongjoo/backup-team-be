const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Users = require('./db/users');
const Articles = require('./db/articles');
const jwtConfig = require('./jwt_config');
const jwtVerify = require('./jwt_verify');

const app = express();
const port = 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// 로그인 페이지
app.post('/login', (req, res) => {
    try{
        const {email, password} = req.body;

        const existUsers = Users.find(user => user.email === email && user.password === password);

        if (!existUsers) {
            return res.status(400).json({message: "이메일 혹은 비밀번호가 틀렸습니다."})
        };
        const token = jwt.sign({userId : existUsers.id}, jwtConfig.secretKey, jwtConfig.options);
        return res.cookie("user",token),

        res.status(200).json({message: "로그인에 성공했습니다."});
    }
    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
});

// 유저 정보 확인
app.get('/users', (req, res) => {
    try{
        const user = req.cookies.user;
        const token = jwt.verify(user, jwtConfig.secretKey);
        const data = jwt.decode(user, jwtConfig.secretKey);

        if (token) {
            return res.send({data})
        }
    } catch {
        res.send("로그인 후 사용 가능합니다.")
    }
});

// 홈페이지 + 모든 게시글 조회
app.get('/home', (req,res) => { 
    // console.log(Articles)
    try{
        const articles = Articles.map(article => {return article});
        res.status(200).send(articles.splice(0, 10))
        if (!articles) {
            res.send("게시글이 없습니다.")
        }
    } 
    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    } 
});


// 게시글 작성
app.post('/article', jwtVerify, async (req,res) => {
    try{
        const user = req.cookies.user;
        const decoded = jwt.decode(user, jwtConfig.secretKey);
        const user_id = decoded.userId
        const {id , title, contents, created_at, count} = req.body;

        const existArticle = Articles.find(article => article.id === id)
        if (existArticle) {
            return res.status(400).json({message : "이미 존재하는 게시글 입니다."});
        }
        return Articles.push({id , title, contents, user_id, created_at, count}),
        res.status(200).json({message: "게시글 작성 완료"})
    } 

    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
});

// 게시글 상세 조회
app.get('/article/:id', (req,res) => {
    try{
        const {id} = req.params;
        // const article = Articles.map()
        const articles = Articles.find(article => article.id === Number(id))
        // console.log(article)
        if (!articles) {
            return res.status(400).json({message: "존재하지 않는 게시글 입니다."});
        };
        return res.status(200).json({articles});
    }

    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
});

//게시글 수정
app.post('/article/:id', jwtVerify, async (req,res) => {
    try{
        const {id} = req.params;
        const {contents} = req.body;
        
        const user = req.cookies.user;
        const decoded = jwt.decode(user, jwtConfig.secretKey);
        const user_id = decoded.userId
        console.log(user_id)

        const article = Articles.find(article => article.id === Number(id))
        
        console.log(article.user_id)
        if (article && article.user_id === user_id) {
            return 
        }
        return res.status(400).json({Message : "작성자만 수정할 수 있습니다."})
    }
    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
});

//프로필 + 내가 작성한 글 조회
app.get('/profile/:id', async (req, res) => {
    try{
        const checkid = req.cookies.user;
        if (!checkid) {
            return res.status(404).json({message: "로그인이 필요한 페이지입니다."});
        }
        const {id} = req.params;
        // article의 user_id와 params로 준 id 값이 같은 article만 가져와라
        const userArticles = Articles.filter(article => article.user_id === Number(id))

        if (userArticles) {
            res.status(200).json({userArticles})
        }
    }
    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
});

app.listen(port, () => {
    console.log("서버 오픈");
});