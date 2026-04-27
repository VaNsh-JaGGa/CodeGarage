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