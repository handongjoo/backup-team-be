let conn = null
require("./conn").then(mysqlConn => {
    conn = mysqlConn
})

const {findOneById, findOne} = require('./db')

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

const getUser = async (id) => {
    return await findOneById("users", id)
}

const getUserByEmailAndPassword = async (email, password) => {
    return await findOne('users', {email, password})
}

const getMyProfile = async (id) => {
    return await findOneById("users", id)
}

module.exports = {getUser, getUserByEmailAndPassword, getMyProfile, getUsers}