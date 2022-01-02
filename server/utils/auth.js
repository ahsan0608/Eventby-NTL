/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/utils/auth.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 19th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

require("dotenv").config();
const jwt = require("./jwt");
const models = require("../models");

module.exports = (redirectAuthenticated = true) => {
  return function (req, res, next) {
    const token = req.cookies[process.env.COOKIE] || "";

    Promise.all([
      jwt.verifyToken(token),
      models.TokenBlacklist.findOne({ token }),
    ])
      .then(([data, blacklistToken]) => {
        if (blacklistToken) {
          return Promise.reject(new Error("blacklisted token"));
        }

        models.User.findById(data.id).then((user) => {
          req.user = user;
          next();
        });
      })
      .catch((err) => {
        if (!redirectAuthenticated) {
          next();
          return;
        }

        if (
          [
            "token expired",
            "blacklisted token",
            "jwt must be provided",
          ].includes(err.message)
        ) {
          res.status(401).json({
            success: false,
            message: "UNAUTHORIZED!",
          });
          return;
        }

        next(err);
      });
  };
};
