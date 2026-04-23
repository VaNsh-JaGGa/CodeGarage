const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
    "Order",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        // it is a foregin key which tells who have this order
        buyerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        // Sum of all items in this order
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pending", "processing", "shipped", "delivered", "cancelled"),
            defaultValue: "pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = Order;