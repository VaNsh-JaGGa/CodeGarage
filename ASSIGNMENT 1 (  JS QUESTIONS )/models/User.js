const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING, 
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,          
            unique: true, 
            validate: {
                isEmail: true, 
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        role: {
            type: DataTypes.ENUM("buyer", "seller", "admin"),
            defaultValue: "buyer",
        },

        token: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        timestamps: true, //createdat and updatedat do column apne ap iss table me aajayege
    }
);

module.exports = User; 