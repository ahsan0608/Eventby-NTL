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
