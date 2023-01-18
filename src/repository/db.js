const mysql = require("mysql2/promise")
// const conn = require('./conn')

let connection = null
async function conn() {
    connection = await mysql.createConnection({
        host: "caredog-test.c0o6spnernvu.ap-northeast-2.rds.amazonaws.com",
        user: "sparta",
        password: "tmvkfmxk2022",
        database: "sparta_backup"
  })
  console.log("db연결 완료")
}
conn()

const findOne = async (table, conditions) => {
    const conditionString =Object.keys(conditions).map(field => `${field} = ?`).join(" and ")
    const [result] = await connection.execute(`select * from ${table} where ${conditionString}`,Object.values(conditions))
    if (!result.length) {
        throw new Error('Not found')
    }
    return result[0]
}

const getUserByEmailAndPassword = async (email, password) => {
    return await findOne('users', {email, password})
}

const getArticles = async (currentPage, perPage, startIndex) => {
    const [articlesCount] = await connection.execute('select count(*) as count from articles')
    
    const [articles] = await connection.execute("select * from articles order by id desc limit ? OFFSET ?", [perPage, startIndex])

    const lastPage = Math.ceil(articlesCount[0].count / perPage)

    return {
        articlesCount,
        lastPage,
        currentPage,
        articles
    }
}
module.exports = {getUserByEmailAndPassword, getArticles}