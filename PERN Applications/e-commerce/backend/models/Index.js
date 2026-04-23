const sequelize = require("../config/database");
const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");
const OrderItem = require("./OrderItem");

User.hasMany(Product, { foreignKey: "sellerId", as: "products" });
Product.belongsTo(User, { foreignKey: "sellerId", as: "seller" });

User.hasMany(Order, { foreignKey: "buyerId", as: "orders" });
Order.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" }); 

module.exports = {User, Product, Order, OrderItem, sequelize};