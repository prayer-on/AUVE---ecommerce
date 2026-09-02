const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const Product = require("../models/Product");

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`❌ Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    console.log(`Payment confirmed for PaymentIntent: ${paymentIntent.id}`);

    try {
      const { userId, items: itemsRaw, shippingDetails: shippingRaw } = paymentIntent.metadata;
      
      const items = JSON.parse(itemsRaw);
      const shippingDetails = JSON.parse(shippingRaw);

      const newOrder = new Order({
        userId,
        items,
        totalAmount: paymentIntent.amount / 100, 
        shippingDetails,
        paymentIntentId: paymentIntent.id,
        status: "Processing"
      });

      await newOrder.save();
      console.log("Order successfully saved to MongoDB via Webhook!");

      for (const item of items) {
        const stockField = `sizesStock.${item.size}`;
        await Product.findOneAndUpdate(
          { id: item.productId },
          { $inc: { [stockField]: -item.quantity } }
        );
      }
      console.log("AUVE inventory updated successfully!");

    } catch (dbError) {
      console.error("Error saving order during Webhook processing:", dbError.message);
    }
  }

  res.json({ received: true });
};
