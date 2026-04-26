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
router.get("/users", ...adminOnly, getAllUsers);

//   /api/admin/users/:id
router.delete("/users/:id", ...adminOnly, deleteUser);

//   /api/admin/stats
router.get("/stats", ...adminOnly, getStats);

//   /api/admin/orders
router.get("/orders", ...adminOnly, getAllOrders);

//   /api/admin/orders/:id/status
router.put("/orders/:id/status",updateOrderStatus);

module.exports = router;