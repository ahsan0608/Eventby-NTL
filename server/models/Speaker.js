/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/models/User.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: December 12th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) @BRL
 */

const mongoose = require("mongoose");
const Joi = require("joi");

const speakerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      minlength: 6,
      maxlength: 255,
    },
  },
  {
    timestamps: true,
  }
);

function validateSpeaker(speaker) {
  const schema = Joi.object({
    firstName: Joi.string()
      .alphanum()
      .regex(/[a-zA-Z]/)
      .required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
  });

  return schema.validate(speaker);
}

module.exports = mongoose.model("Speaker", speakerSchema);
module.exports.validateSpeaker = validateSpeaker;
