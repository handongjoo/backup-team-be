const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mysql = require("mysql");
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

const connection = mysql.createConnection({
    host: "caredog-test.c0o6spnernvu.ap-northeast-2.rds.amazonaws.com",
    user: "sparta",
    password: "tmvkfmxk2022",
    database: "sparta_backup"
})

connection.connect();

// 홈페이지 + 모든 게시글 조회
app.get('/home', (req,res) => { 
    try{
        const {page} = req.query;
        const perPage = 20
        const startIndex = ((page || 1) - 1) * perPage
        const currentPage = page || 1
        connection.query('select count(*) as count from articles', (error, rows, fields) => {
            if (error) {
                console.log(error);
                return res.status(500).send({error: error.message})
            }
            const totalCount = rows[0].count
            const lastPage = Math.ceil(totalCount / perPage)
            connection.query(`select * from articles order by id desc limit ${perPage} OFFSET ${startIndex}`, (error, rows, fields) => {
                const result = {
                    rows,
                    totalCount,
                    lastPage,
                    currentPage
                }
                res.send(result)
            })
        })
        
    } 
    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    } 
});

app.get("/users", async (req, res) => {
    const page = req.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
  
    const [results, fields] = await connection.query(
      "SELECT * FROM users LIMIT ? OFFSET ?",
      [limit, offset]
    );
  
    const totalCount = await connection.query("SELECT COUNT(*) as cnt FROM users");
  
    const pageCount = Math.ceil(totalCount[0].cnt / limit);
  
    res.render("users", { users: results, pageCount: pageCount, currentPage: page });
  });

    // 로그인 페이지
app.post('/login', (req, res) => {
    try{
        const {name, password} = req.body;
        const query = "SELECT * FROM users WHERE name = ? AND password = ?"

        connection.query(query, [name, password] ,(error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send({error: error.message});
        }
        if (!results.length) {
            res.status(400).json({message: "이름이나 비밀번호가 틀렸습니다."})
            return
            
        } else {
            const token = jwt.sign({userId : results.name}, jwtConfig.secretKey, jwtConfig.options);
            return res.cookie("user",token),
            res.status(200).json({message: "로그인 성공"})
            }
        });

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

// 게시글 작성 (user_id를 받는 인증 미들웨어 수정 필요, user_id를 직접 넣어주면 가능하긴 함)
app.post('/articles', jwtVerify, (req,res) => {
    try{
        const user = req.cookies.user;
        console.log(user)
        const decoded = jwt.decode(user, jwtConfig.secretKey);
        console.log(decoded)
        const user_id = decoded.userId // 로그인 한 user의 id값
        const {title, contents} = req.body;
        const query = "INSERT INTO articles (title, contents, user_id) values (?,?,?)"
        connection.query(query, [title, contents, user_id] ,(error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send({error: error.message});
            }
            if (!results.length) {
                res.status(400).json({message: "모든 항목을 작성해주세요."})
                return
            } else {
                return res.status(200).json({message: "작성완료"})
                }
            });
    } 
    catch(error) {
        console.error(error);
        res.status(500).json({message : error.Message});
    }
});

// 게시글 상세 조회
app.get('/articles/:id', (req,res) => {
    try{
        const id = req.params.id;
        const query = "SELECT * FROM articles WHERE id = ?"
        connection.query(query, [id] ,(error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send({error: error.message});
            }
            if (!results.length) {
                res.status(400).json({message: "없는 게시글 입니다."})
                return
            } else {
                return res.status(200).send(results)
                }
            });
    }

    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
});

//게시글 수정
app.post('/articles/:id', jwtVerify, (req,res) => {
    try{
        const {id} = req.params;
        const {contents} = req.body;
        
        const user = req.cookies.user;
        const decoded = jwt.decode(user, jwtConfig.secretKey);
        const user_id = decoded.userId // 로그인 한 user의 id값

        const query = "SELECT * FROM articles WHERE id = ?"
        connection.query(query, [id] ,(error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send({error: error.message});
            }
            if (!results.length) {
                res.status(400).json({message: "없는 게시글 입니다."})
                return
            } else {
                results.contents = contents
                return res.status(201).json({Message: "수정완료"})
                }
            })
    
        
    }
    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
});

// 게시글 삭제
app.delete('/articles/:id', jwtVerify, (req, res) => {
    const {id} = req.params;

    const user = req.cookies.user;
    const decoded = jwt.decode(user, jwtConfig.secretKey);
    const user_id = decoded.userId

    const query = "SELECT * FROM articles WHERE id = ?"
    connection.query(query, [id] ,(error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send({error: error.message});
        }
        if (!results.length) {
            res.status(400).json({message: "없는 게시글 입니다."})
            return
        } else {
            return res.status(201).json({results})
            }
        })

    const articleIndex = Articles.findIndex(article => article.id === Number(id))
    

    if (!article) {
        res.json({message : "게시글이 존재하지 않습니다."})
        return
    }
    if (article.user_id !== user_id) {
        res.json({message : "삭제 권한이 없습니다."})
        return
    }
    Articles.splice(articleIndex, 1)
    return res.json({message: "삭제가 완료되었습니다."})
})

//프로필 + 내가 작성한 글 조회
app.get('/profile/:id', (req, res) => {
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