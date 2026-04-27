const express = require('express');
const router =  express.Router();
const {protect} = require('../middleware/Authmiddleware');
const {getMyOrders,getOrderById,placeOrder} = require("../controllers/orderController");

router.get("/",protect,getMyOrders);
router.post("/",protect,placeOrder);
router.get("/:id",protect,getOrderById);

module.exports = router;
