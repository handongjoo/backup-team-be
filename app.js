const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Users = require('./db/users');
const Articles = require('./db/articles');
const jwtConfig = require('./jwt_config');
const jwtVerify = require('./jwt_verify');

const corsOptions = {
    origin: true,
    credentials: true
};

const app = express();
const port = 3000;

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

    // 로그인 페이지
    app.post('/login', (req, res) => {
    try{
        const {email, password} = req.body;

        const existUsers = Users.find(user => user.email === email && user.password === password);

        if (!existUsers) {
            return res.status(400).json({success: false, msg:"이메일 혹은 비밀번호가 틀렸습니다."})
        };
        const token = jwt.sign({userId : existUsers.id}, jwtConfig.secretKey, jwtConfig.options);
        return res.cookie("user",token),
        res.status(200).json({success: true})
    }
    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
});

// 유저 정보 확인
app.get('/users', jwtVerify, (req, res) => {
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

// 홈페이지 + 모든 게시글 조회
app.get('/home', (req,res) => { 
    // console.log(Articles)
    try{
        const articles = Articles.map(article => {return article});

        if(!req.cookies.user) {
            return res.status(400).json({message: "로그인 후 이용 가능합니다."})
        }
        return res.status(200).send(articles.splice(0, 10))
        // if (!articles) {
        //     res.send("게시글이 없습니다.")
        // }
    } 
    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    } 
});


// 게시글 작성
app.post('/article', jwtVerify, (req,res) => {
    try{
        const user = req.cookies.user;
        const decoded = jwt.decode(user, jwtConfig.secretKey);
        const user_id = decoded.userId // 로그인 한 user의 id값
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

        const article = Articles.find(article => article.id === Number(id))

        if (!article) {
            return res.status(400).json({message: "존재하지 않는 게시글 입니다."});
        };
        return res.status(200).json({article});
    }

    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
});

//게시글 수정
app.post('/article/:id', jwtVerify, (req,res) => {
    try{
        const {id} = req.params;
        const {contents} = req.body;
        
        const user = req.cookies.user;
        const decoded = jwt.decode(user, jwtConfig.secretKey);
        const user_id = decoded.userId // 로그인 한 user의 id값
        // article의 id 값과 parameter로 준 id 값이 같은지 확인 
        const article = Articles.find(article => article.id === Number(id))
        // 위의 article이 true이고 그 article의 user_id가 로그인 한 user의 id값과 같다면
        if (!article || article.user_id !== user_id) {
            return res.status(400).json({Message : "작성자만 수정할 수 있습니다."})
        }
        return article.contents = contents, // article의 새로운 contents요소에 body 데이터로 준 contents 값을 넣는다
        res.status(201).json({Message: "수정완료"})
    }
    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
});

//프로필 + 내가 작성한 글 조회
app.get('/profile', (req, res) => {
    try{
        const user = req.cookies.user;
        const decoded = jwt.decode(user, jwtConfig.secretKey);
        const user_id = decoded.userId
        // article의 user_id와 user DB의 id값이 같은 article을 모두 가져와라
        const userArticles = Articles.filter(article => article.user_id === user_id)

        if (userArticles) {
            res.status(200).json({decoded, userArticles})
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