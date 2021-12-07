const mongoose = require("mongoose");

const MailSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    subject: String,
    to: [{ type: String }],
    event: { type: mongoose.Types.ObjectId, ref: "Event" },
    user_sender: { type: mongoose.Types.ObjectId, ref: "User" },
    dateSent: Date,
    lastResponded: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Mail", MailSchema);
