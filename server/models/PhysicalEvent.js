/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/models/PhysicalEvent.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 21th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

const mongoose = require("mongoose");

const PhysicalEventSchema = new mongoose.Schema(
  {
    event_location: {
      type: String,
      required: true,
    },
    event_address_line1: {
      type: String,
      required: true,
    },
    event_address_line2: {
      type: String,
      required: true,
    },
    event_country: {
      type: String,
      required: true,
    },
    event_city_town: {
      type: String,
      required: true,
    },
    event_state: {
      type: String,
      required: true,
    },
    event_postal_code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PhysicalEvent", PhysicalEventSchema);
