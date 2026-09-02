const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true },
  images: [{ type: String }],
  price: { type: Number, required: true },
  weight: { type: Number, required: true },
  color: { type: String, required: true },
  fit: { type: String, required: true },
  material: { type: String, required: true }, 
  sizesStock: {
  XS: { type: Number, default: 0 },
  S: { type: Number, default: 0 },
  M: { type: Number, default: 0 },
  L: { type: Number, default: 0 },
  XL: { type: Number, default: 0 },
  Onesize: { type: Number, default: 0 }
}
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);