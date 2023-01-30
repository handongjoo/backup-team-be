let conn = null
require("./conn").then(mysqlConn => {
    conn = mysqlConn
})

const Article = require('../models/article.model')
const User = require('../models/user.model')

// 홈페이지 (전체 게시물)
const getArticles = async (limit, offset) => {
    
    const totalCount = await Article.count()
    const articles = await Article.findAll({
        include: [{
            model : User,
            attributes: {
                exclude: ["password"]
            }
        }],
        order:[["id","desc"]], 
        limit, 
        offset})
    const lastPage = Math.ceil(totalCount / limit)

    return {totalCount, 
    lastPage, 
    articles
    }
}

// 게사물 상세
const getArticle = async (id) => {
    return await Article.findByPk(id)
}

// 게시물 작성(생성)
const createArticle = async (title, contents, user_id) => {
    return await Article.create({title, contents, user_id})
}

// 게시물 수정
const updateArticle = async (title, contents, id) => {
    return await Article.update({title, contents}, {where: {id}})
}

// 게시물 삭제
const deleteArticle = async (id) => {
    return await Article.destroy({where: {id}})
}



module.exports = {getArticles, getArticle, createArticle, updateArticle, deleteArticle}