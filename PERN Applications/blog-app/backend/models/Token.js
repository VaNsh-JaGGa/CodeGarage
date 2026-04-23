const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Token = sequelize.define('Token', {
  token: {
    type: DataTypes.TEXT,     
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Token;