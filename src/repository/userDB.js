let conn = null
require("./conn").then(mysqlConn => {
    conn = mysqlConn
})

const User = require('../models/user.model')
const Article = require('../models/article.model')

// 유저 목록 조회 (연습용)
const getUsers = async (limit, offset) => {
    // const [totalCount] = await conn.execute('select count(*) as count from users')
    const totalCount = await User.count()
    // const [users] = await conn.execute("select * from users limit ? OFFSET ?", [limit, offset])
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

module.exports = {getUser, getUserByEmailAndPassword, getMyProfile, getUsers}