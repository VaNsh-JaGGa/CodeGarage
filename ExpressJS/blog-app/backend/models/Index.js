const sequelize = require('../config/database');
const User = require('./User');
const Blog = require('./Blog');
const Token = require('./Token');
const Like = require('./Like');
const Comment = require('./Comment');

Blog.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Blog, { foreignKey: 'userId' });

User.hasMany(Token, { foreignKey: 'userId' });
Token.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'liker' });
Blog.hasMany(Like, { foreignKey: 'blogId', as: 'likes' });
Like.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'commenter' });
Blog.hasMany(Comment, { foreignKey: 'blogId', as: 'comments' });
Comment.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' });


module.exports = { sequelize, User, Blog, Like, Comment };
// Export all models together