const mongoose = require("mongoose");
const moment = require("moment");

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
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
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
    recurring_event: {
      type: mongoose.Types.ObjectId,
      ref: "REvent",
    },
    event_status: {
      type: String,
      default: "EVENT_CREATED",
      enum: ["EVENT_CREATED", "EVENT_RUNNING", "EVENT_PAUSE", "EVENT_END"],
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

function validateEventDate(start_date, end_date) {
  var dateValidationBool = false;
  const isValidStartDate = moment(start_date).isValid();
  const isValidEndDate = moment(end_date).isValid();
  if (isValidStartDate && isValidEndDate) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var eventStartDate = new Date(start_date);
    var eventEndDate = new Date(end_date);

    if (today < eventStartDate && today < eventEndDate) {
      dateValidationBool = true;
    }
  }

  return dateValidationBool;
}

module.exports = mongoose.model("Event", EventSchema);
module.exports.validateDate = validateEventDate;
