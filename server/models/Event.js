const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 3,
    },
    event_banner: {
      data: Buffer,
      contentType: String,
      description: String,
    },
    date: {
      type: Date,
      required: true,
    },
    event_type: {
      type: String,
      enum: ["physical", "online", "hybrid"],
    },
    event_type_details: {
      type: mongoose.Types.ObjectId,
      ref: "EventTypeDetails",
    },
    ticket: {
      type: mongoose.Types.ObjectId,
      ref: "Ticket",
    },
    admin: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    mail: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Mail",
      },
    ],
    invitee: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    participant: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", EventSchema);
