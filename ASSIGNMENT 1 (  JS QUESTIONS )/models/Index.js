// backend/models/index.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Import all models and define their relationships (associations).
// Think of this file as the "relationship map" of your database.
// ─────────────────────────────────────────────────────────────────────────────

const sequelize = require("../config/database"); // Our DB connection
const User = require("./User");                  // Users table
const Product = require("./Product");            // Products table
const Order = require("./Order");                // Orders table
const OrderItem = require("./OrderItem");        // Order items table

// ── RELATIONSHIPS ─────────────────────────────────────────────────────────────
// Think of these like: "A seller HAS MANY products", "A product BELONGS TO a seller"

// 1. User (seller) → Product
//    One seller can have many products
User.hasMany(Product, { foreignKey: "sellerId", as: "products" });
//    Each product belongs to one seller
Product.belongsTo(User, { foreignKey: "sellerId", as: "seller" });

// 2. User (buyer) → Order
//    One buyer can place many orders
User.hasMany(Order, { foreignKey: "buyerId", as: "orders" });
//    Each order belongs to one buyer
Order.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });

// 3. Order → OrderItem
//    One order can have many items
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
//    Each order item belongs to one order
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// 4. Product → OrderItem
//    One product can appear in many order items
Product.hasMany(OrderItem, { foreignKey: "productId" });
//    Each order item refers to one product
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Export everything so server.js and controllers can import from one place
module.exports = { sequelize, User, Product, Order, OrderItem };

// ─────────────────────────────────────────────────────────────────────────────
// FLOW IN THIS FILE:
// 1. Import all 4 models
// 2. Define associations (relationships) between them
// 3. Sequelize uses these to auto-generate JOIN queries and add helper methods
//    e.g. order.getItems(), user.getProducts(), etc.
// 4. Export everything for use in controllers and server.js
//
// DATABASE RELATIONSHIP DIAGRAM:
//   User ──(1:many)──► Product      (seller has products)
//   User ──(1:many)──► Order        (buyer places orders)
//   Order ──(1:many)──► OrderItem   (order has items)
//   Product ──(1:many)──► OrderItem (product in many order items)
// ─────────────────────────────────────────────────────────────────────────────