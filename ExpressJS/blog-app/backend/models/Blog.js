
const { DataTypes } = require('sequelize');
// Import column type definitions

const sequelize = require('../config/database');
// Import database connection

const Blog = sequelize.define('Blog', {
    id: {
        type: DataTypes.INTEGER,    // integer column
        autoIncrement: true,        // auto generate id
        primaryKey: true,           // unique identifier
    },

    title: {
        type: DataTypes.STRING,     // short text (for blog title)
        allowNull: false,           // required field
    },

    content: {
        type: DataTypes.TEXT,       // long text (for blog body/description)
        allowNull: false,           // required field
    },

    image_url: {
        type: DataTypes.STRING,     // optional image URL for the blog
        allowNull: true,            // not required
    },

    userId: {
        type: DataTypes.INTEGER,    // foreign key — stores which user wrote this blog
        allowNull: false,           // every blog must have an author
    },
});

module.exports = Blog;
// Export so other files can use it