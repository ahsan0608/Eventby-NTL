const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    ticket_type: {
      type: String,
      enum: ["free", "paid"],
    },
    sale_start_date: {
      type: String,
      minlength: 3,
    },
    sale_start_time: {
      type: String,
      minlength: 3,
    },
    sale_end_date: {
      type: String,
      minlength: 3,
    },
    sale_end_time: {
      type: String,
      minlength: 3,
    },
    custom_ticket: [
      {
        type: mongoose.Types.ObjectId,
        ref: "CustomTicket",
      },
    ],
    event: {
      type: mongoose.Types.ObjectId,
      ref: "Event",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", TicketSchema);
