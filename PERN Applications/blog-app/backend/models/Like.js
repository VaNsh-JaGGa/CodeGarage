const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Like = sequelize.define('Like', {
    id: {
       type: DataTypes.INTEGER,
        autoIncrement: true,  
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    blogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type:{
        type: DataTypes.ENUM('like', 'dislike'),
        allowNull: false,
    },
});

module.exports = Like;