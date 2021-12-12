/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/models/index.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 20th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

const User = require("./User");
const Event = require("./Event");
const TokenBlacklist = require("./TokenBlackList");
const Mail = require("./Mail");
const Invitee = require("./Invitee");
const Ticket = require("./Ticket");
const CustomTicket = require("./CustomTicket");
const Payment = require("./Payment");
const REvent = require("./REvent");
const EventTypeDetails = require("./EventTypeDetails");
const Speaker = require("./Speaker");

module.exports = {
  User,
  Event,
  TokenBlacklist,
  Invitee,
  Mail,
  Ticket,
  CustomTicket,
  Payment,
  REvent,
  EventTypeDetails,
  Speaker,
};
