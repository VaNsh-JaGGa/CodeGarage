const cartItems = await Cart.findAll({
    where: { buyerId: req.user.id },
    include: [{ model: Product, as: "product" }],
});

if (cartItems.length === 0) {
    await transaction.rollback();
    return res.status(400).json({ message: "Your cart is empty" });
}

for (const item of cartItems) {
    if (item.product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
            message: `Not enough stock for "${item.product.name}". Available: ${item.product.stock}`,
        });
    }
}

const totalPrice = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.product.price) * item.quantity; // price * qty
}, 0);

const order = await Order.create(
    {
        buyerId: req.user.id,
        totalPrice: totalPrice.toFixed(2),
        status: "pending",
    },
    // yahan pr  hmko transaction pass krna mandatory hai taaki is operation ko bhi isi transaction ka hissa mana jaye
    { transaction }
);

const orderItemsData = cartItems.map((item) => ({
    orderId: order.id,
    productId: item.productId,
    quantity: item.quantity,
    price: item.product.price,
}));

await OrderItem.bulkCreate(orderItemsData, { transaction });

for (const item of cartItems) {
    await Product.update(
        { stock: item.product.stock - item.quantity }, // New stock value
        { where: { id: item.productId }, transaction }  // For this product
    );
}

await Cart.destroy({
    where: { buyerId: req.user.id },
    transaction,
});

await transaction.commit();

return res.status(201).json({
    message: "Order placed successfully!",
    order: { id: order.id, totalPrice: order.totalPrice, status: order.status },
});