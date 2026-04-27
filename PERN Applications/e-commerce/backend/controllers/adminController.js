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

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role === "admin") {
            return res.status(403).json({ message: "Cannot delete admin accounts" });
        }
        await user.destroy();
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        return res.status(500).json({ message: "Failed to delete user" });
    }
};

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

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    as: "buyer",
                    attributes: ["id", "name", "email"],
                },
                {
                    model: OrderItem,   
                    as: "items",
                    include: [
                        {
                            model: Product,
                            as: "product",
                            attributes: ["id", "name", "price"],
                        },
                    ],
                },
            ],
            order: [["createdAt", "DESC"]], 
        });

        return res.status(200).json({ orders });
    } catch (error) {
        console.error("Get all orders error:", error);
        return res.status(500).json({ message: "Failed to fetch orders" });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;  
        const { status } = req.body;

        const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const order = await Order.findByPk(id)
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        console.error("Update order status error:", error);
        return res.status(500).json({ message: "Failed to update order" });
    }
};

module.exports = { getAllUsers, deleteUser, getStats, getAllOrders, updateOrderStatus };