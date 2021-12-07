const mongoose = require("mongoose");

const EventTypeMappingSchema = new mongoose.Schema(
  {
    eventTypeId: {
      type: String,
      required: true,
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

module.exports = mongoose.model("EventTypeMapping", EventTypeMappingSchema);
