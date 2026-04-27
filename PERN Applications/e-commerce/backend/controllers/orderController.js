const { Model } = require("sequelize");
const { Cart, Product, Order, OrderItem, User } = require("../models/index");
const { sequelize } = require("../models/index");

// this controller will return the past orders of logged in users
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { buyerId: req.user.id },                      //iis buyer ke orders dedo
            include: [
                {
                    model: OrderItem,
                    as: "items",
                    include:
                        [{ model: Product, as: "product", attributes: ["id", "name", "image_url"] }]
                }],
            order: [["createdAt", "DESC"]],
        });
        return res.status(200).json({ orders });
    }
    catch (err) {
        console.log("getMyOrders Controller Response Error", err);
        return res.status(500).json({
            message: "Failed to get Orders",
        })
    }
}

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({
            where: { id, buyerId: req.user.id },
            include: [{
                model: OrderItem, as: "items",
                include: [{ model: Product, as: "product" }]
            }]
        })
        if (!order) {
            return res.status(404).json({
                message: "Order Not Found",
            })
        }
        return res.status(200).json({ order });
    }
    catch (err){
        console.log("getOrderById Controller error", err)
        return res.status(500).json({ message: "Failed to Fetch your Order" });
    }
}

const placeOrder = async (req, res) => {
    // sequelize.transaction ek feature hai jisse hum multiple database operations ko ek sath perform kr skte hain.
    // iska main use tb hota hai jb hum chahate hain ki agar ek bhi operation fail ho
    // toh pura process rollback ho jaye.
    // rollback matlab purane database state me le jaye
    const transaction = await sequelize.transaction();
    try {
        
    } catch (error) {
        await transaction.rollback(); // If anything threw an error, undo everything
        console.error("Place order error:", error);
        return res.status(500).json({ message: "Failed to place order" });
    }
};



module.exports = { getMyOrders, getOrderById, placeOrder }