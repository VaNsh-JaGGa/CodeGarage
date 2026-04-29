const express = require('express');
const router = express.Router();
const {getAllProducts,getSingleProduct,getMyProducts,createProduct,deleteProduct} = require("../controllers/productController");
const {protect} = require("../middleware/Authmiddleware")

// Create the Product
router.post("/",protect,createProduct);
// Delete the Product
router.delete("/:id",protect,deleteProduct);
// Return all the products of every Seller
router.get("/",protect,getAllProducts);
// Return all the Products of Single User
router.get("/my-products",protect,getMyProducts);
// Return one product by id
router.get("/:id",protect,getSingleProduct);

module.exports=router;
