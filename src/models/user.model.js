const { Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize('sparta_backup', 'sparta', 'tmvkfmxk2022', {
    host: 'caredog-test.c0o6spnernvu.ap-northeast-2.rds.amazonaws.com',
    dialect: 'mysql'
});

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    created_at: DataTypes.DATE,
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = User