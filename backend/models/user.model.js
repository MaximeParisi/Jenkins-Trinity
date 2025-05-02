const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNumber: Number,
    password: String,
    billingAddress: {
      address: String,
      zipCode: String,
      city: String,
      country: String,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;