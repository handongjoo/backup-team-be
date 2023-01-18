
let conn = null
require("./conn").then(mysqlConn => {
    conn = mysqlConn
})

const findOne = async (table, conditions) => {
    const conditionString =Object.keys(conditions).map(field => `${field} = ?`).join(" and ")
    const [result] = await conn.execute(`select * from ${table} where ${conditionString}`,Object.values(conditions))
    if (!result.length) {
        throw new Error('Not found')
    }
    return result[0]
}

const findAll = async (table, conditions) => {
    const conditionString =Object.keys(conditions).map(field => `${field} = ?`).join(" and ")
    const [result] = await conn.execute(`select * from ${table} where ${conditionString}`,Object.values(conditions))
    if (!result.length) {
        throw new Error('Not found')
    }
    return result
}

const findOneById = async (table, value, key) => {
    const pk = key || 'id'
    const [rows] = await conn.execute(`select * from ${table} where id = ${pk}`, [value])
    if (!rows.length) {
        throw new Error("Not found")
    }
    return rows[0]
}



module.exports = {findOne, findOneById, findAll}