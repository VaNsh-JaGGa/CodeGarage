const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,       // column type is integer
        autoIncrement: true,           // auto increases: 1, 2, 3...
        primaryKey: true,              // this is the unique identifier for each row
    },

    username: {
        type: DataTypes.STRING,        // text column
        allowNull: false,              // this field is required (cannot be empty)
        unique: true,                  // no two users can have same username
    },

    email: {
        type: DataTypes.STRING,        // text column
        allowNull: false,              // required
        unique: true,                  // unique email per user
        validate: {
        isEmail: true,                 // Sequelize will validate it's a real email format
        },
    },

    password: {
        type: DataTypes.STRING,        // text column (will store hashed password)
        allowNull: false,              // required
    },
});

module.exports = User;
// Export so other files (controller, model index) can use it