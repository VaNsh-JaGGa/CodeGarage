const sequelize = require("../config/database");
const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Cart = require("./Cart");

User.hasMany(Product, { foreignKey: "sellerId", as: "products" });
Product.belongsTo(User, { foreignKey: "sellerId", as: "seller" });

User.hasMany(Order, { foreignKey: "buyerId", as: "orders" });
Order.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" }); 

User.hasMany(Cart, { foreignKey: "buyerId", as: "cartItems" });
Cart.belongsTo(User, { foreignKey: "buyerId" });

Product.hasMany(Cart, { foreignKey: "productId" });
Cart.belongsTo(Product, { foreignKey: "productId", as: "product" });

module.exports = { sequelize, User, Product, Order, OrderItem, Cart };