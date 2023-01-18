let conn = null
require("./conn").then(mysqlConn => {
    conn = mysqlConn
})

const {findOneById, findOne} = require('./db')

const getArticles = async (perPage, startIndex) => {
    
    const [totalCount] = await conn.execute('select count(*) as count from articles')
    const [articles] = await conn.execute("select * from articles order by id desc limit ? OFFSET ?", [perPage, startIndex])
    const lastPage = Math.ceil(totalCount[0].count / perPage)

    return {totalCount, 
    lastPage, 
    articles
    }
}

const getArticle = async (id) => {
    return await findOneById("articels", id)
}

const createArticle = async (title, contents, user_id) => {
    return await conn.execute(
        "INSERT INTO articles (title, contents, user_id) values (?,?,?)", 
        [title, contents, user_id]
        )
}

const updateArticle = async (title, contents, id) => {
    return await conn.execute(
        "UPDATE articles SET title = ?, contents = ? WHERE id = ?",
        [title, contents, id]
        )
}

const deleteArticle = async (id) => {
    return await conn.execute(
        "DELETE FROM articles WHERE id = ?",
        [id]
    )
}
module.exports = {getArticles, getArticle, createArticle, updateArticle, deleteArticle}