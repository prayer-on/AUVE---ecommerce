const express = require("express");
const router = express.Router();
const cartController = require("../controllers/Cart");
const verifyToken = require("../middleware/authMiddleware")

router.get("/", verifyToken, cartController.getCart);

router.post("/add", verifyToken, cartController.addToCart);

router.delete("/clear", verifyToken, cartController.clearCart);

router.delete("/remove/:productId/:size", verifyToken, cartController.removeItemFromCart);

router.put("/update", verifyToken, cartController.updateQuantity);


module.exports = router;