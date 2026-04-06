// This file connects all models together and sets up relationship
const sequelize = require('../config/database');
// Import the database connection

const User = require('./User');
// Import User model

const Blog = require('./Blog');
// Import Blog model

// Define relationship: One User can have Many Blogs
User.hasMany(Blog, { foreignKey: 'userId', as: 'blogs' });
// 'foreignKey: userId' means Blog table will have a userId column pointing to User
// 'as: blogs' lets us do user.getBlogs() later

Blog.belongsTo(User, { foreignKey: 'userId', as: 'author' });
// Blog belongs to one User
// 'as: author' lets us do blog.getAuthor() later

module.exports = { sequelize, User, Blog };
// Export everything so server.js can sync them all