const mongoose = require("mongoose");

const OnlineEventSchema = new mongoose.Schema(
  {
    event_platform: {
      type: String,
      required: true,
    },
    event_platform_link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OnlineEvent", OnlineEventSchema);
