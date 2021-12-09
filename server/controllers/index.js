/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/controllers/index.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 18th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) @BRL
 */

const home = require("./home.controller");
const user = require("./user.controller");
const event = require("./event.controller");
const auth = require("./auth.controller");

module.exports = {
  user,
  event,
  auth,
};
