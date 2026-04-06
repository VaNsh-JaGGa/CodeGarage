const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Blog = sequelize.define('Blog', {
    id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,     
        primaryKey: true,
    },

    title: {
        type: DataTypes.STRING, 
        allowNull: false,     
    },

    content: {
        type: DataTypes.TEXT,   
        allowNull: false,       
    },

    image_url: {
        type: DataTypes.STRING,     
        allowNull: true,           
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Blog;