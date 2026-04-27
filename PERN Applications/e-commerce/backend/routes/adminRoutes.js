const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    deleteUser,
    getStats,
    getAllOrders,
    updateOrderStatus,
} = require("../controllers/adminController");

const { protect} = require("../middleware/authMiddleware");

//   /api/admin/users
router.get("/users", protect, getAllUsers);

//   /api/admin/users/:id
router.delete("/users/:id", protect , deleteUser);

//   /api/admin/stats
router.get("/stats", protect , getStats);

//   /api/admin/orders
router.get("/orders", protect , getAllOrders);

//   /api/admin/orders/:id/status
router.put("/orders/:id/status",updateOrderStatus);

module.exports = router;