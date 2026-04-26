const { User, Product, Order, OrderItem } = require("../models/index");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "name", "email", "role", "createdAt"],
            order: [["createdAt", "DESC"]],
        });
        return res.status(200).json({ users });
    } catch (error) {
        console.error("Get all users error:", error);
        return res.status(500).json({ message: "Failed to fetch users" });
    }
};

// ── DELETE A USER ─────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params; // User ID from URL

        const user = await User.findByPk(id); // Find user by primary key
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent deleting admin accounts for safety
        if (user.role === "admin") {
            return res.status(403).json({ message: "Cannot delete admin accounts" });
        }

        await user.destroy(); // Delete user row from DB

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        return res.status(500).json({ message: "Failed to delete user" });
    }
};

// ── GET PLATFORM STATS ────────────────────────────────────────────────────────
// Returns counts used by the admin dashboard summary cards
const getStats = async (req, res) => {
    try {
        const userCount = await User.count();    // How many users total
        const productCount = await Product.count(); // How many products total
        const orderCount = await Order.count();   // How many orders total

        return res.status(200).json({
            users: userCount,
            products: productCount,
            orders: orderCount,
        });
    } catch (error) {
        console.error("Get stats error:", error);
        return res.status(500).json({ message: "Failed to fetch stats" });
    }
};

// ── GET ALL ORDERS (ADMIN VIEW) ───────────────────────────────────────────────
// Admin can see every order placed on the platform with buyer and item details
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: User,              // JOIN the buyer's info
                    as: "buyer",
                    attributes: ["id", "name", "email"], // Only safe fields
                },
                {
                    model: OrderItem,         // JOIN order items
                    as: "items",
                    include: [
                        {
                            model: Product,       // JOIN product name inside each item
                            as: "product",
                            attributes: ["id", "name", "price"],
                        },
                    ],
                },
            ],
            order: [["createdAt", "DESC"]], // Most recent orders first
        });

        return res.status(200).json({ orders });
    } catch (error) {
        console.error("Get all orders error:", error);
        return res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// ── UPDATE ORDER STATUS ───────────────────────────────────────────────────────
// Admin can change the status of any order
// e.g. "pending" -> "processing" -> "shipped" -> "delivered"
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;        // Order ID from URL
        const { status } = req.body;      // New status from request body

        // Validate the status value
        const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const order = await Order.findByPk(id); // Find the order
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;            // Update status
        await order.save();               // Save to DB

        return res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        console.error("Update order status error:", error);
        return res.status(500).json({ message: "Failed to update order" });
    }
};

module.exports = { getAllUsers, deleteUser, getStats, getAllOrders, updateOrderStatus };
// deleteUser        -> Find user -> reject if admin -> destroy row
// getStats          -> Count users, products, orders -> return 3 numbers
// getAllOrders       -> Find ALL orders -> JOIN buyer + items + products
// updateOrderStatus -> Find order by ID -> validate new status -> update + save
// ─────────────────────────────────────────────────────────────────────────────