const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();

const app = express();

const webhookRoutes = require("./routes/webhookRoutes");
app.use("/api/webhooks", webhookRoutes);


app.use(cors({origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  credentials: true
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));



if (!process.env.MONGO_URI) {
  console.error("CRITICAL ERROR: The MONGO_URI variable is not defined in the .env file!");
  process.exit(1);
}

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const productsRoutes = require('./routes/productsRoutes');
app.use('/api/products', productsRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('--- CONNECTED SUCCESSFULLY WITH MONGODB ATLAS ---');
  })
  .catch(err => {
    console.error('Error during MongoDB connection:', err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});