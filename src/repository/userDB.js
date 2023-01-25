let conn = null
require("./conn").then(mysqlConn => {
    conn = mysqlConn
})

const User = require('../models/user.model')
const Article = require('../models/article.model')

// 유저 목록 조회 (연습용)
const getUsers = async (limit, offset) => {
    const totalCount = await User.count()
    const users = await User.findAll({offset, limit}) 
    const pageCount = Math.ceil(totalCount / limit);

    return {
        totalCount,
        users,
        pageCount
    }
}


// 유저 정보 조회
const getUser = async (id) => {
    return await User.findByPk(id)
}

// 로그인
const getUserByEmailAndPassword = async (email, password) => {
    return await User.findOne({where: {email, password}})
}

// 유저 프로필
const getMyProfile = async (id) => {
    return await User.findByPk(id)
}

// 내가 쓴 게시물
const getMyArticles = async (user_id) => {
    return await Article.findAll({where:{user_id}})
}

module.exports = {getUser, getUserByEmailAndPassword, getMyProfile, getUsers, getMyArticles}