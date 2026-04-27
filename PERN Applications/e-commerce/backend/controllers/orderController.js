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
    const transaction = await sequelize.transaction();

    try {
        const cartItems = await Cart.findAll({
            where: { buyerId: req.user.id },
            include: [{ model: Product, as: "product" }],
            transaction,
        });

        if (cartItems.length === 0) {
            await transaction.rollback();
            return res.status(400).json({
                message: "Your cart is empty",
            });
        }

        for (const item of cartItems) {
            if (!item.product) {
                await transaction.rollback();
                return res.status(404).json({
                    message: "One of the products in your cart no longer exists",
                });
            }

            if (item.product.stock < item.quantity) {
                await transaction.rollback();
                return res.status(400).json({
                    message: `Not enough stock for "${item.product.name}". Available: ${item.product.stock}`,
                });
            }
        }

        const totalPrice = cartItems.reduce((sum, item) => {
            return sum + parseFloat(item.product.price) * item.quantity;
        }, 0);

        const order = await Order.create(
            {
                buyerId: req.user.id,
                totalPrice: totalPrice.toFixed(2),
                status: "pending",
            },
            { transaction }
        );

        const orderItems = cartItems.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
        }));

        await OrderItem.bulkCreate(orderItems, { transaction });

        for (const item of cartItems) {
            item.product.stock -= item.quantity;
            await item.product.save({ transaction });
        }

        await Cart.destroy({
            where: { buyerId: req.user.id },
            transaction,
        });

        await transaction.commit();

        return res.status(201).json({
            message: "Order placed successfully",
            order: {
                id: order.id,
                totalPrice: order.totalPrice,
                status: order.status,
            },
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Place order error:", error);
        return res.status(500).json({ message: "Failed to place order" });
    }
};

module.exports = { getMyOrders, getOrderById, placeOrder }
