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
      }
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













// frontend/src/pages/CartPage.jsx
// PURPOSE: Buyer's cart. Uses api helper, skeleton loader, toast notifications.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import { CartItemSkeleton } from "../components/Skeleton";

const CartPage = () => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState("0.00");
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  // ── FETCH CART ────────────────────────────────────────────────────────────────
  const fetchCart = async () => {
    try {
      const data = await api.get("/cart", token);
      setCartItems(data.cartItems);
      setTotalPrice(data.totalPrice);
    } catch (err) {
      showToast(err.message || "Failed to load cart", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  // ── UPDATE QUANTITY ───────────────────────────────────────────────────────────
  const handleUpdateQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await api.put(`/cart/${itemId}`, { quantity: newQty }, token);
      fetchCart(); // Reload to get updated total
    } catch (err) {
      showToast(err.message || "Failed to update quantity", "error");
    }
  };

  // ── REMOVE ITEM ───────────────────────────────────────────────────────────────
  const handleRemove = async (itemId, itemName) => {
    try {
      await api.del(`/cart/${itemId}`, token);
      showToast(`"${itemName}" removed from cart`, "info");
      fetchCart();
    } catch (err) {
      showToast(err.message || "Failed to remove item", "error");
    }
  };

  // ── CHECKOUT ──────────────────────────────────────────────────────────────────
  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      await api.post("/orders", {}, token);
      showToast("Order placed successfully!", "success");
      navigate("/orders");
    } catch (err) {
      showToast(err.message || "Checkout failed", "error");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Your Cart 🛒</h1>

        {/* ── Skeleton loading ─────────────────────────────────────────────── */}
        {loading && <CartItemSkeleton count={3} />}

        {/* ── Empty cart ───────────────────────────────────────────────────── */}
        {!loading && cartItems.length === 0 && (
          <div className="text-center text-slate-400 py-20">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-lg font-medium">Your cart is empty</p>
            <button
              onClick={() => navigate("/home")}
              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5
                         rounded-xl text-sm font-semibold transition"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* ── Cart items + summary ─────────────────────────────────────────── */}
        {!loading && cartItems.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Cart items list */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4
                             flex gap-4 items-center"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => navigate(`/product/${item.product?.id}`)}
                    className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden
                               flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-500/40
                               transition"
                  >
                    {item.product?.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>

                  {/* Name + price */}
                  <div className="flex-1 min-w-0">
                    <p
                      onClick={() => navigate(`/product/${item.product?.id}`)}
                      className="text-white font-medium text-sm truncate cursor-pointer
                                 hover:text-blue-400 transition"
                    >
                      {item.product?.name}
                    </p>
                    <p className="text-blue-400 text-sm font-semibold mt-0.5">
                      ₹{parseFloat(item.product?.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white
                                 font-bold transition disabled:opacity-30 disabled:cursor-not-allowed
                                 flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="text-white font-semibold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white
                                 font-bold transition flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p className="text-slate-300 text-sm font-medium w-20 text-right">
                    ₹{(parseFloat(item.product?.price) * item.quantity).toFixed(2)}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item.id, item.product?.name)}
                    className="text-red-400 hover:text-red-300 transition text-xl ml-1 leading-none"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary panel */}
            <div className="lg:w-72">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-20">
                <h2 className="text-white font-semibold text-lg mb-4">Order Summary</h2>

                <div className="flex justify-between text-slate-400 text-sm mb-2">
                  <span>{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</span>
                  <span>₹{totalPrice}</span>
                </div>

                <div className="border-t border-white/10 my-4" />

                <div className="flex justify-between text-white font-bold text-lg mb-6">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-800
                             disabled:cursor-not-allowed text-white font-bold py-3
                             rounded-xl transition"
                >
                  {checkingOut ? "Placing Order..." : "Place Order ✓"}
                </button>

                <button
                  onClick={() => navigate("/home")}
                  className="w-full mt-3 text-slate-400 hover:text-white text-sm transition"
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

// FLOW:
// 1. On load → api.get("/cart") → skeleton shown while waiting
// 2. Qty buttons → api.put("/cart/:id") → reload cart
// 3. Remove → api.del("/cart/:id") → toast + reload
// 4. Checkout → api.post("/orders") → success toast → navigate to /orders

















// frontend/src/pages/OrdersPage.jsx
// PURPOSE: Buyer's order history. Uses api helper + skeleton + expandable cards.

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import { OrderCardSkeleton } from "../components/Skeleton";

const OrdersPage = () => {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null); // Which order card is open

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.get("/orders", token);
        setOrders(data.orders);
      } catch (err) {
        showToast(err.message || "Failed to load orders", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // Status styles
  const statusStyle = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    processing: "bg-blue-500/10   text-blue-400   border-blue-500/20",
    shipped: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    delivered: "bg-green-500/10  text-green-400  border-green-500/20",
    cancelled: "bg-red-500/10    text-red-400    border-red-500/20",
  };

  const statusEmoji = {
    pending: "⏳", processing: "⚙️", shipped: "🚚", delivered: "✅", cancelled: "❌",
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">My Orders 🧾</h1>

        {/* Skeleton */}
        {loading && <OrderCardSkeleton count={4} />}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div className="text-center text-slate-400 py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-lg font-medium">No orders yet</p>
            <p className="text-sm mt-1">Your placed orders will appear here</p>
          </div>
        )}

        {/* Orders */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                {/* Header row — always visible, click to expand */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer
                              hover:bg-white/5 transition"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div>
                    <p className="text-white font-semibold">Order #{order.id}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full border capitalize
                                   ${statusStyle[order.status] || statusStyle.pending}`}>
                    {statusEmoji[order.status]} {order.status}
                  </span>

                  <div className="text-right">
                    <p className="text-white font-bold">₹{parseFloat(order.totalPrice).toFixed(2)}</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {expanded === order.id ? "▲ Hide" : "▼ Details"}
                    </p>
                  </div>
                </div>

                {/* Expandable items section */}
                {expanded === order.id && (
                  <div className="border-t border-white/10 px-4 py-3 space-y-3">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0">
                          {item.product?.image_url ? (
                            <img src={item.product.image_url} alt={item.product?.name}
                              className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm">📦</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-200 text-sm truncate">
                            {item.product?.name || "Unknown Product"}
                          </p>
                          <p className="text-slate-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-slate-300 text-sm font-medium">
                          ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}

                    <div className="border-t border-white/10 pt-3 flex justify-between">
                      <span className="text-slate-400 text-sm">Order Total</span>
                      <span className="text-white font-bold">
                        ₹{parseFloat(order.totalPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

// FLOW:
// 1. api.get("/orders") → skeleton shown while loading
// 2. Each order card shows id, date, status badge, total
// 3. Click → expands to show each product name, qty, subtotal