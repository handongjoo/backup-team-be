const { Sequelize, DataTypes} = require('sequelize');

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

module.exports = Article