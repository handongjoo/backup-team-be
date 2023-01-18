const jwt = require("jsonwebtoken");
const jwtConfig = require('../config/configuration');
const {getArticle, getArticles, createArticle, updateArticle, deleteArticle} = require('../repository')

const homePageArticles = async (req,res) => { 
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

}

const postArticle = async (req,res) => {
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
}

const detailArticle = async (req,res) => {
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
}

const editArticle = async (req,res) => {
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
}

const destroyArticle = async (req, res) => {
    const {id} = req.params;

    try{
        await deleteArticle(id)

        return res.status(200).send({message: "삭제완료"})
    } catch(error) {
        console.error(error);
        res.status(500).json({errorMessage : error.Message});
    }
}

module.exports = {homePageArticles, postArticle, detailArticle, editArticle, destroyArticle}