// purpose of making this --- handling the cart operations for the buyers.................
const { Cart, Product } = require("../PERN Applications/e-commerce/backend/models/index"); // Import Cart and Product model
// Returns all cart items for the logged-in buyer, with product details
const getCart = async (req, res) => {
  try {
    // Find all cart rows where buyerId = logged-in user
    const cartItems = await Cart.findAll({
      where: { buyerId: req.user.id },       // Filter by current user
      include: [
        {
          model: Product,                    // JOIN with products table
          as: "product",                     // Use the alias defined in models/index.js
          attributes: ["id", "name", "price", "stock", "image_url"], // Only these columns
        },
      ],
    });

    // Calculate total price across all cart items
    // parseFloat converts the stored DECIMAL string to a JavaScript number
    const totalPrice = cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity; // price × qty
    }, 0); // Start sum at 0

    return res.status(200).json({
      cartItems,                             // Array of cart items with product info
      totalPrice: totalPrice.toFixed(2),     // Formatted to 2 decimal places
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({ message: "Failed to fetch cart" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < 1) {
      return res.status(400).json({ message: "Product is out of stock" });
    }
    // basically ye check kr rha hai ki same product already cart me hai ya nhi 
    const existingItem = await Cart.findOne({
      where: { buyerId: req.user.id, productId },
    });
    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();
      return res.status(200).json({ message: "Quantity updated", cartItem: existingItem });
    }
    // product is not in cart 
    const cartItem = await Cart.create({
      buyerId: req.user.id,
      productId,
      quantity: quantity || 1,
    });

    return res.status(201).json({ message: "Added to cart", cartItem });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ message: "Failed to add to cart" });
  }
};
// Changes the quantity of an existing cart item
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;         // Cart item ID from URL: /api/cart/3
    const { quantity } = req.body;     // New quantity from request body

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Find the cart item
    const cartItem = await Cart.findOne({
      where: {
        id,                            // The cart item's ID
        buyerId: req.user.id,          // Make sure it belongs to this buyer
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = quantity;      // Set new quantity
    await cartItem.save();             // Save to DB

    return res.status(200).json({ message: "Cart updated", cartItem });
  } catch (error) {
    console.error("Update cart error:", error);
    return res.status(500).json({ message: "Failed to update cart" });
  }
};

// ── REMOVE FROM CART ───────────────────────────────────────────────────────────
// Removes a single item from the cart
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params; // Cart item ID

    const cartItem = await Cart.findOne({
      where: { id, buyerId: req.user.id }, // Must belong to this buyer
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.destroy(); // Delete the row from DB

    return res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Remove cart item error:", error);
    return res.status(500).json({ message: "Failed to remove item" });
  }
};

// ── CLEAR ENTIRE CART ─────────────────────────────────────────────────────────
// Removes ALL items from the buyer's cart (used after checkout)
const clearCart = async (req, res) => {
  try {
    await Cart.destroy({
      where: { buyerId: req.user.id }, // Delete all rows for this buyer
    });

    return res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Clear cart error:", error);
    return res.status(500).json({ message: "Failed to clear cart" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
// getCart       → Find all Cart rows for this user, JOIN product info, calc total
// addToCart     → Check product exists + has stock → upsert (update OR insert)
// updateCartItem→ Find cart row by ID + buyerId → change quantity → save
// removeFromCart→ Find row by ID + buyerId → destroy row
// clearCart     → Destroy ALL rows for this buyerId (called after placing order)
// ─────────────────────────────────────────────────────────────────────────────








// backend/routes/cartRoutes.js
// PURPOSE: Cart routes with validation on add and update.

const express = require("express");
const router = express.Router();

const {
  getCart, addToCart, updateCartItem, removeFromCart, clearCart,
} = require("../controllers/cartController");

const { protect, restrictTo } = require("../middleware/authMiddleware");
const { validateCartItem, validateQuantity } = require("../middleware/validateMiddleware");

// All cart actions are buyer-only
router.get("/", protect, restrictTo("buyer"), getCart);
router.post("/", protect, restrictTo("buyer"), validateCartItem, addToCart);
router.put("/:id", protect, restrictTo("buyer"), validateQuantity, updateCartItem);
router.delete("/:id", protect, restrictTo("buyer"), removeFromCart);
router.delete("/", protect, restrictTo("buyer"), clearCart);

module.exports = router;



















// backend/controllers/orderController.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Handle order placement and retrieval.
// When a buyer checks out, this controller:
//   1. Reads their cart
//   2. Validates stock
//   3. Creates an Order + OrderItems
//   4. Reduces product stock
//   5. Clears the cart
// ─────────────────────────────────────────────────────────────────────────────

const { Cart, Product, Order, OrderItem, User } = require("../PERN Applications/e-commerce/backend/models/index");
const { sequelize } = require("../PERN Applications/e-commerce/backend/models/index"); // For transactions

// ── PLACE ORDER (CHECKOUT) ────────────────────────────────────────────────────
// Converts the buyer's cart into a real order
const placeOrder = async (req, res) => {
  // Use a Sequelize TRANSACTION — if any step fails, ALL steps are rolled back
  // Think of it as: "do all of this, or do none of it"
  const transaction = await sequelize.transaction();

  try {
    // Step 1: Get all cart items for this buyer, including product details
    const cartItems = await Cart.findAll({
      where: { buyerId: req.user.id },       // This buyer's cart
      include: [{ model: Product, as: "product" }], // Join product info
    });

    // Step 2: Check cart is not empty
    if (cartItems.length === 0) {
      await transaction.rollback(); // Undo everything
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // Step 3: Validate stock for each item before proceeding
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Not enough stock for "${item.product.name}". Available: ${item.product.stock}`,
        });
      }
    }

    // Step 4: Calculate the total price
    const totalPrice = cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity; // price * qty
    }, 0);

    // Step 5: Create the Order record
    const order = await Order.create(
      {
        buyerId: req.user.id,              // Who placed the order
        totalPrice: totalPrice.toFixed(2), // Round to 2 decimal places
        status: "pending",                 // Starts as pending
      },
      { transaction }                      // Include in transaction
    );

    // Step 6: Create one OrderItem row per cart item
    const orderItemsData = cartItems.map((item) => ({
      orderId: order.id,                   // Link to the order we just created
      productId: item.productId,           // Which product
      quantity: item.quantity,             // How many
      price: item.product.price,           // Snapshot of price at purchase time
    }));

    await OrderItem.bulkCreate(orderItemsData, { transaction }); // Create all at once

    // Step 7: Reduce stock for each product
    for (const item of cartItems) {
      await Product.update(
        { stock: item.product.stock - item.quantity }, // New stock value
        { where: { id: item.productId }, transaction }  // For this product
      );
    }

    // Step 8: Clear the buyer's cart
    await Cart.destroy({
      where: { buyerId: req.user.id },
      transaction,
    });

    // Step 9: Commit the transaction — save all changes to DB permanently
    await transaction.commit();

    return res.status(201).json({
      message: "Order placed successfully!",
      order: { id: order.id, totalPrice: order.totalPrice, status: order.status },
    });
  } catch (error) {
    await transaction.rollback(); // If anything threw an error, undo everything
    console.error("Place order error:", error);
    return res.status(500).json({ message: "Failed to place order" });
  }
};

// ── GET BUYER'S ORDERS ────────────────────────────────────────────────────────
// Returns all past orders for the logged-in buyer, with items inside
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { buyerId: req.user.id },       // Only this buyer's orders
      include: [
        {
          model: OrderItem,
          as: "items",                       // JOIN order items
          include: [
            {
              model: Product,
              as: "product",                 // JOIN product info inside each item
              attributes: ["id", "name", "image_url"], // Only these columns
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],        // Most recent orders first
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Get my orders error:", error);
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ── GET SINGLE ORDER ──────────────────────────────────────────────────────────
// Returns full details of one order (buyer can only see their own)
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params; // Order ID from URL

    const order = await Order.findOne({
      where: {
        id,
        buyerId: req.user.id, // Ensure buyer can only see their own order
      },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error("Get order by ID error:", error);
    return res.status(500).json({ message: "Failed to fetch order" });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById };

// ─────────────────────────────────────────────────────────────────────────────
// FLOW IN THIS FILE:
// placeOrder:
//   1. Fetch cart items with product data
//   2. Validate all items have enough stock
//   3. Calculate total price
//   4. Create Order row
//   5. Create one OrderItem per cart item (with price snapshot)
//   6. Decrement stock for each product
//   7. Clear the buyer's cart
//   8. All inside a TRANSACTION (all-or-nothing)
//
// getMyOrders:
//   → Query orders where buyerId = current user
//   → Include nested OrderItems and their product names/images
//
// getOrderById:
//   → Find one order, verify it belongs to current buyer
//   → Return full details
// ─────────────────────────────────────────────────────────────────────────────






// backend/routes/orderRoutes.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Define URL paths for order operations.
// Only buyers can place orders. Both buyers and admins can view them.
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();

const { placeOrder, getMyOrders, getOrderById } = require("../controllers/orderController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// ── POST /api/orders ───────────────────────────────────────────────────────────
// Checkout: converts cart to an order. Buyer only.
router.post("/", protect, restrictTo("buyer"), placeOrder);

// ── GET /api/orders ────────────────────────────────────────────────────────────
// Get logged-in buyer's order history
router.get("/", protect, restrictTo("buyer"), getMyOrders);

// ── GET /api/orders/:id ────────────────────────────────────────────────────────
// Get full details of one order (buyer sees their own only)
router.get("/:id", protect, restrictTo("buyer"), getOrderById);

module.exports = router;

// ─────────────────────────────────────────────────────────────────────────────
// FLOW IN THIS FILE:
// POST /         → checkout (buyer only) — converts cart to order
// GET  /         → list all orders for this buyer
// GET  /:id      → full details of one order
//
// server.js mounts at /api/orders so full paths are:
//   POST   http://localhost:5000/api/orders
//   GET    http://localhost:5000/api/orders
//   GET    http://localhost:5000/api/orders/7
// ─────────────────────────────────────────────────────────────────────────────