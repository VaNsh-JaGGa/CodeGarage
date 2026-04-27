const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

//ek particular item ek row me aayegi 
//order ke andar ke items ki yaha par , 1 item -> 1 row ( includes quantity ).
const OrderItem = sequelize.define(
    "OrderItem",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,      
        },

        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },  
    {
        timestamps: true,
    }
);

module.exports = OrderItem;
 
// har row ek product ko dikhayegi