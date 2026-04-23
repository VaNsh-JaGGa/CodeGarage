// Each product belongs to a seller (a User with role = 'seller').
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
    "Product",
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

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
  
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        // FOREIGN KEY IS this
        sellerId: {
            type: DataTypes.INTEGER,
            allowNull: false, // becase har product ka seller hona hi chahiye
        },
    },
    {
        timestamps: true,
    }
);

module.exports = Product;