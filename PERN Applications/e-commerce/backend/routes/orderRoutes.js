const express = require('express');
const router =  express.Router();
const {protect} = require('../middleware/Authmiddleware');
const {getMyOrders,getOrderById} = require("../controllers/orderController");

router.get("/",protect,getMyOrders);
router.get("/:id",protect,getOrderById);

module.exports = router;