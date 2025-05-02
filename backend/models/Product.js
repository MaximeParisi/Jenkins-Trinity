const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  brand: { type: String, required: true },
  picture: { type: String },
  category: { type: String, required: true },
  nutritionalInformation: { type: Object },
  availableQuantity: { type: Number, required: true },
});

module.exports = mongoose.model("Product", ProductSchema);
