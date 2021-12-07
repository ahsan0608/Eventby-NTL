const mongoose = require("mongoose");

const CustomTicketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: String,
    },
    currency: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CustomTicket", CustomTicketSchema);
