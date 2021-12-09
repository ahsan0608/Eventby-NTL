/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/models/CustomTicket.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 25th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 Your Company
 */

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
