let conn = null
require("./conn").then(mysqlConn => {
    conn = mysqlConn
})

const {findOneById, findOne} = require('./db')

// 홈페이지 (전체 게시물)
const getArticles = async (perPage, startIndex) => {
    
    const [totalCount] = await conn.execute('select count(*) as count from articles')
    const [articles] = await conn.execute("select * from articles order by id desc limit ? OFFSET ?", [perPage, startIndex])
    const lastPage = Math.ceil(totalCount[0].count / perPage)

    return {totalCount, 
    lastPage, 
    articles
    }
}

// 게사물 상세
const getArticle = async (id) => {
    return await findOneById("articels", id)
}

// 게시물 작성(생성)
const createArticle = async (title, contents, user_id) => {
    return await conn.execute(
        "INSERT INTO articles (title, contents, user_id) values (?,?,?)", 
        [title, contents, user_id]
        )
}

// 게시물 수정
const updateArticle = async (title, contents, id) => {
    return await conn.execute(
        "UPDATE articles SET title = ?, contents = ? WHERE id = ?",
        [title, contents, id]
        )
}

// 게시물 삭제
const deleteArticle = async (id) => {
    return await conn.execute(
        "DELETE FROM articles WHERE id = ?",
        [id]
    )
}

module.exports = {getArticles, getArticle, createArticle, updateArticle, deleteArticle}