const Cart = require("../models/Cart");
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {

try {

    const userId = req.user.id;
    const {productId, title, price, img, size, quantity } = req.body

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found in the catalog." });
    }

    const availableStock = product.sizesStock ? (product.sizesStock[size] || 0) : 0;


    let cart = await Cart.findOne({ userId });
    let currentQuantityInCart = 0;

     if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId && item.size === size
      );
      if (itemIndex > -1) {
        currentQuantityInCart = cart.items[itemIndex].quantity;
      }
    }

    const requestedTotal = currentQuantityInCart + (Number(quantity) || 1);
    if (requestedTotal > availableStock) {
      return res.status(400).json({ 
        message: `Action refused. Insufficient stock! Left in stock: ${availableStock}` 
      });
    }

    if (!cart) {

    cart = new Cart({
        userId,
        items: [{ productId, title, price, img, size, quantity: quantity || 1 }]
    });
}

    else {
        const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId && item.size === size
      );

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
    }

    else {
        cart.items.push({ productId, title, price, img, size, quantity: quantity || 1 });
    }
    cart.updatedAt = Date.now();
}

await cart.save();
return res.status(200).json(cart);

}

catch (error) {
res.status(500).json({ message: "Error loading the cart", error: error.message })
}
};

exports.getCart = async (req, res) => {
    
    try {

        const userId= req.user.id;
        const cart = await Cart.findOne({ userId })
    
    if (!cart) {
    return res.status(200).json({ userId, items:[] });
    }

    return res.status(200).json(cart);
    }

    catch (error) {
    res.status(500).json({ message: "Error retrieving the cart", error: error.message });
    }
};

exports.clearCart = async (req, res) => {

    try {

        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });

        if (cart) {
        cart.items = [];
        cart.updatedAt = Date.now();
        await cart.save();
        }

        return res.status(200).json({ message: "Cart cleared successfully", cart});
    }

    catch (error) {
    res.status(500).json({ message: "Error clearing the cart", error: error.message});
    }
};

exports.removeItemFromCart = async (req, res) => {

    try {
        
        const userId = req.user.id;
        const { productId, size } = req.params;

        const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (itemIndex > -1) {

      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }

      cart.updatedAt = Date.now();
      await cart.save();
      return res.status(200).json(cart);
    } 
    
  else {
      return res.status(404).json({ message: "Item not found in the cart" });
    }
  } 
  
  catch (error) {
    return res.status(500).json({ message: "Error during item removal", error: error.message });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { productId, size, action } = req.body;

    if (!productId || !size || !action) {
      return res.status(400).json({ message: "Incomplete data to update the cart!" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      console.log(`Created a new cart in the DB for user: ${userId}`);
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );


    if (itemIndex > -1) {
      if (action === "increment") {
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: "Product not found in the catalog." });
        }

        const availableStock = product.sizesStock ? (product.sizesStock[size] || 0) : 0;
        const currentQtyInCart = cart.items[itemIndex].quantity;

        if (currentQtyInCart + 1 > availableStock) {
          return res.status(400).json({ 
            message: `Cannot increase quantity. Only ${availableStock} items left in stock!` 
          });
        }

        cart.items[itemIndex].quantity += 1;

      } else if (action === "decrement") {
        cart.items[itemIndex].quantity -= 1;

        if (cart.items[itemIndex].quantity <= 0) {
          cart.items.splice(itemIndex, 1);
        }
      } else {
        return res.status(400).json({ message: "Invalid action! Use 'increment' or 'decrement'" });
      }

      cart.updatedAt = Date.now();
      await cart.save();
      return res.status(200).json(cart);

    } else {
      return res.status(404).json({ message: "Item not found in the cart" });
    }

  } catch (error) {
    console.error("Errore updateQuantity:", error.message);
    return res.status(500).json({ message: "Error updating cart quantity", error: error.message });
  }
};
