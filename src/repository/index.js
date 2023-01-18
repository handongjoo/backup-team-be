const users = require('./userDB')
const articles = require('./articleDB')

module.exports = {
    ...users,
    ...articles
    } 