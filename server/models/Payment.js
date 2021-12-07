const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
    },
    cardType: {
      type: String,
    },
    paymentThrough: {
      type: String,
      minlength: 3,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    event: {
      type: mongoose.Types.ObjectId,
      ref: "Event",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", PaymentSchema);
