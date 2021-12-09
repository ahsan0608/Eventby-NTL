/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/models/Mail.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 28th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

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
