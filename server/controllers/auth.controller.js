/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/controllers/auth.controller.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 25th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

const passport = require("passport");
const models = require("../models");

module.exports = {
  get: {
    googleProfile: (req, res, next) => {
      passport.authenticate("google", {
        scope: ["profile", "email"],
      });
    },
    googleCallback: (req, res, next) => {
      passport.authenticate("google"),
        (req, res) => {
          res.redirect("/events");
        };
    },
  },
};
