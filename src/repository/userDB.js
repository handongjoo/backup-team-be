let conn = null
require("./conn").then(mysqlConn => {
    conn = mysqlConn
})

const {findOneById, findOne} = require('./db')

// 유저 목록 조회 (연습용)
const getUsers = async (limit, offset) => {
    const [totalCount] = await conn.execute('select count(*) as count from users')
    const [users] = await conn.execute("select * from users limit ? OFFSET ?", [limit, offset])
    const pageCount = Math.ceil(totalCount[0].count / limit);
    
    return {
        totalCount,
        users,
        pageCount
    }
}

// 유저 정보 조회
const getUser = async (id) => {
    return await findOneById("users", id)
}

// 로그인
const getUserByEmailAndPassword = async (email, password) => {
    return await findOne('users', {email, password})
}

// 유저 프로필
const getMyProfile = async (id) => {
    return await findOneById("users", id)
}

module.exports = {getUser, getUserByEmailAndPassword, getMyProfile, getUsers}