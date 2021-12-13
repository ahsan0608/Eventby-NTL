/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/models/User.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: December 13th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) @BRL
 */

const mongoose = require("mongoose");
const Joi = require("joi");

const sponsorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

function validateSponsor(sponsor) {
  const schema = Joi.object({
    name: Joi.string()
      .alphanum()
      .regex(/[a-zA-Z]/)
      .required(),
    website: Joi.string().required(),
  });

  return schema.validate(sponsor);
}

module.exports = mongoose.model("Sponsor", sponsorSchema);
module.exports.validateSponsor = validateSponsor;
