const { Product, User } = require("../models/index"); // Import models

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{ model: User, as: "seller", attributes: ["id", "name"] }],
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({ products }); // ye array of products dega
    } catch (error) {
        console.error("Get products error:", error);
        return res.status(500).json({ message: "Failed to fetch products" });
    }
};

const getMyProducts = async (req, res) => {
    try {
        console.log("inside try block");
        const products = await Product.findAll({
            where: { sellerId: req.user.id }, 
            order: [["createdAt", "DESC"]],
        });
        return res.status(200).json({ message:"Product Created",products });
    } catch (error) {
        console.error("Get my products error:", error);
        return res.status(500).json({ message: "Failed to fetch your products" });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, image_url } = req.body;

        if (!name || !price) {
            return res.status(400).json({ message: "Name and price are required" });
        }

        const product = await Product.create({
            name,
            description,
            price,
            stock: stock || 0,
            image_url,
            sellerId: req.user.id,      // middleware ne create kia
        });

        return res.status(201).json({ message: "Product created", product });
    } catch (error) {
        console.error("Create product error:", error);
        return res.status(500).json({ message: "Failed to create product" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params; // Get product ID from URL: /api/products/5
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (req.user.role !== "admin" && product.sellerId !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your own products" });
        }
        
        await product.destroy(); // Delete kardon db me se
        return res.status(200).json({ message: "Product deleted" });
    } catch (error) {
        console.error("Delete product error:", error);
        return res.status(500).json({ message: "Failed to delete product" });
    }
};

module.exports = { getAllProducts, getMyProducts, createProduct, deleteProduct };