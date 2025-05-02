const mongoose = require("mongoose");

const Cart = mongoose.model(
  "Cart",
  new mongoose.Schema({
    userId: String,
    products: {
      type : [Object],
      default : []
    }
  })
);

module.exports = Cart;