const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/Payment")
const verifyToken = require('../middleware/authMiddleware');

router.post("/create-intent", verifyToken, paymentController.createPaymentIntent)

module.exports = router;