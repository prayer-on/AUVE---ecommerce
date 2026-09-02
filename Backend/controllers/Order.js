const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, totalAmount, shippingDetails, paymentIntentId } = req.body;

    if (!items || items.length === 0 || !shippingDetails || !paymentIntentId) {
      return res.status(400).json({ message: "Incomplete order data!" });
    }

    const mappedItems = [];

    for (const item of items) {
      let product = null;
      if (item.id && /^[0-9a-fA-F]{24}$/.test(item.id)) {
        product = await Product.findById(item.id);
      }

      mappedItems.push({
        productId: product ? product._id : item.id, 
        title: product ? product.title : (item.title || "Streetwear Product"),   
        price: product ? product.price : (Number(item.price) || 0),   
        size: item.size || "Onesize",
        quantity: Number(item.quantity) || 1
      });
    }

    const newOrder = new Order({
      userId,
      items: mappedItems,
      totalAmount: Number(totalAmount),
      shippingDetails,
      paymentIntentId,
      status: "Processing"
    });

    await newOrder.save();

    for (const item of mappedItems) {
      const stockField = `sizesStock.${item.size}`;
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { [stockField]: -item.quantity } }
      );
    }

    return res.status(201).json({ message: "Order registered and stock updated successfully!", order: newOrder });

  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Internal server error while processing the order.", error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 }); 
    
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving orders", error: error.message });
  }
};