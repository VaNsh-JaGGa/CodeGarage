const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Comment = sequelize.define('Comment', 
    {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    blogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});
module.exports = Comment;