/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/controllers/home.controller.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 25th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

require("dotenv").config();
const models = require("../models");

module.export = {
  get: (req, res, next) => {
    models.User.find()
      .then((users) => res.send(users))
      .catch(next);
  },
};
