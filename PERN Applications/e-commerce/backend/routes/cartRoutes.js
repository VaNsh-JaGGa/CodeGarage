const express = require('express');
const router = express.Router();

const {protect} = require("../middleware/Authmiddleware"); 
const {addToCart,removeFromCart,getCart,updatecartItem, clearCart} = require("../controllers/cartController")

router.get("/",protect,getCart);
router.post("/", protect, addToCart);
router.delete("/:id",protect,removeFromCart);
router.put("/:id",protect,updatecartItem);
router.delete("/",protect,clearCart);

module.exports = router;