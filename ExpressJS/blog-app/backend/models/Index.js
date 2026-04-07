const sequelize = require('../config/database');
const User = require('./User');
const Blog = require('./Blog');
const Token = require('./Token');

Blog.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Blog, { foreignKey: 'userId' });

User.hasMany(Token, { foreignKey: 'userId' });
Token.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Blog, Token };