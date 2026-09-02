const express = require("express");
const router = express.Router();
const orderController = require("../controllers/Order");
const verifyToken = require("../middleware/authMiddleware"); 

router.post("/", verifyToken, orderController.createOrder);

router.get("/my-orders", verifyToken, orderController.getMyOrders);


module.exports = router;
