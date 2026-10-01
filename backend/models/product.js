const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  subcategory: {
    type: String,
  },

  brand: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },

  originalPrice: {
    type: Number,
  },

  discount: {
    type: Number,
    default: 0,
  },

  rating: {
    type: Number,
    default: 0,
  },

  reviews: {
    type: Number,
    default: 0,
  },

  stock: {
    type: Number,
    default: 0,
  },

  description: {
    type: String,
  },

  image: {
    type: String,
    required: true,
  },

  colors: {
    type: [String],
    default: [],
  },

  features: {
    type: [String],
    default: [],
  },

  storage: {
    type: [String],
    default: [],
  },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;

