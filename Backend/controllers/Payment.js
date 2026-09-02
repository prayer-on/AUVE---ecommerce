const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require("../models/Product"); 

exports.createPaymentIntent = async (req, res) => {

  try {
    const userId = req.user.id;
    const { items, shippingDetails } = req.body; 

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty or incomplete!" });
    }

    let calculatedTotalEuro = 0;
    const itemsSummary = [];

    
    for (const item of items) {
      const product = await Product.findById(item.id || item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.id || item.productId} not found!` });
      }

      calculatedTotalEuro += product.price * item.quantity;
      
      itemsSummary.push({
        id: product._id.toString(),
        size: item.size,
        qty: item.quantity
      });
    }

    const totalAmountInCents = Math.round(calculatedTotalEuro * 100);

    if (totalAmountInCents <= 0) {
      return res.status(400).json({ message: "Invalid payment amount." });
    }


    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountInCents, 
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: userId.toString(), 
        items: JSON.stringify(itemsSummary), 
        shippingDetails: shippingDetails ? JSON.stringify(shippingDetails) : "To be completed"
      }
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    console.error("ERROR SERVER:", error)
    return res.status(500).json({ 
      message: "Error during payment intent creation on Stripe", 
      error: error.message 
    });
  }
};
