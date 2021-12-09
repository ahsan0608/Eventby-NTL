/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/models/Ticket.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 23th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

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
