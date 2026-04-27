const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    deleteUser,
    getStats,
    getAllOrders,
    updateOrderStatus,
} = require("../controllers/adminController");

const { protect} = require("../middleware/Authmiddleware");
router.get("/users", protect, getAllUsers);
router.delete("/users/:id", protect , deleteUser);
router.get("/stats", protect , getStats);
router.get("/orders", protect , getAllOrders);
router.put("/orders/:id/status",updateOrderStatus);
module.exports = router;