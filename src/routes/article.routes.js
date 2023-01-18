const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken");
const jwtConfig = require('../config/configuration');
const jwtVerify = require('../config/jwt_verify');
const {getArticle, getArticles, createArticle, updateArticle, deleteArticle} = require('../repository')


// 홈페이지 + 모든 게시글 조회
router.get('/home', async (req,res) => { 
    const page = req.query.page || 1
    const perPage = 20
    const startIndex = (page - 1) * perPage
    try{
        const pageInfo = await getArticles(perPage, startIndex)
        return res.send({pageInfo})

    } catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    } 

});

// 게시글 작성
router.post('/articles', jwtVerify, async (req,res) => {
    try{
        const user = req.cookies.user;

        const decoded = jwt.decode(user, jwtConfig.secretKey);

        const user_id = Number(decoded.userId) // 로그인 한 user의 id값
        const {title, contents} = req.body;
        
        const article = await createArticle(title, contents, user_id)

        return res.status(200).send({article})
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message : error.Message});
    }
});

// 게시글 상세 조회
router.get('/articles/:id', async (req,res) => {
    try{
        const {id} = req.params
        const article = await getArticle(id)
            if (!article) {
                res.status(400).json({message: "없는 게시글 입니다."})
                return
            }
            return res.status(200).send(results)
        }    
    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
});

//게시글 수정
router.post('/articles/:id', jwtVerify, async (req,res) => {
    try{
        const {id} = req.params;
        const {title, contents} = req.body;
        
        const article = await updateArticle(title, contents, id)

        return res.status(201).send({article})
        
    }
    catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
});

// 게시글 삭제
router.delete('/articles/:id', jwtVerify, async (req, res) => {
    const {id} = req.params;

    try{
        await deleteArticle(id)

        return res.status(200).send({message: "삭제완료"})
    } catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
})
//     const query = "SELECT * FROM articles WHERE id = ?"
//     connection.query(query, [id] ,(error, results) => {
//         if (error) {
//             console.log(error);
//             return res.status(500).send({error: error.message});
//         }
//         if (!results.length) {
//             res.status(400).json({message: "없는 게시글 입니다."})
//             return
//         } else {
//             return res.status(201).json({results})
//             }
//         })

//     const articleIndex = Articles.findIndex(article => article.id === Number(id))
    

//     if (!article) {
//         res.json({message : "게시글이 존재하지 않습니다."})
//         return
//     }
//     if (article.user_id !== user_id) {
//         res.json({message : "삭제 권한이 없습니다."})
//         return
//     }
//     Articles.splice(articleIndex, 1)
//     return res.json({message: "삭제가 완료되었습니다."})
// })


module.exports = router