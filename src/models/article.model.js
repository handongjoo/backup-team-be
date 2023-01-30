const { Sequelize, DataTypes} = require('sequelize');
const User = require('./user.model')

const sequelize = new Sequelize('sparta_backup', 'sparta', 'tmvkfmxk2022', {
    host: 'caredog-test.c0o6spnernvu.ap-northeast-2.rds.amazonaws.com',
    dialect: 'mysql'
});

const Article = sequelize.define('articles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: DataTypes.STRING,
    contents: DataTypes.TEXT,
    count: {
        type : DataTypes.INTEGER,
        defaultValue : 0
    },
    user_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

Article.User = Article.belongsTo(User, {
    foreignKey: "user_id"
})

User.Article = User.hasMany(Article, {
    foreignKey: "user_id"
})

module.exports = Article