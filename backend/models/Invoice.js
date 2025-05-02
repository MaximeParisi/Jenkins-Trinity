const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    firstName: String,
    lastName: String,
    phoneNumber: String,
    billingAddress: {
      address: String,
      zipCode: String,
      city: String,
      country: String,
    },
  },
  products: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: Number,
  date: { type: Date, default: Date.now },
  paymentStatus: String,
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
