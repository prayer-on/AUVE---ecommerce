const express = require('express');
const router = express.Router();
const productsController = require("../controllers/Products")
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getOneProduct);

router.post('/add', verifyToken, isAdmin, productsController.createProduct);
router.delete('/:id', verifyToken, isAdmin, productsController.deleteProduct);

module.exports = router;