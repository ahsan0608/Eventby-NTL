/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/models/EventTypeDetails.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 21th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

const mongoose = require("mongoose");

const EventTypeDetailsSchema = new mongoose.Schema(
  {
    event_location: {
      type: String,
    },
    event_address_line1: {
      type: String,
    },
    event_address_line2: {
      type: String,
    },
    event_country: {
      type: String,
    },
    event_city_town: {
      type: String,
    },
    event_state: {
      type: String,
    },
    event_postal_code: {
      type: String,
    },
    event_platform: {
      type: String,
    },
    event_platform_link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EventTypeDetails", EventTypeDetailsSchema);
