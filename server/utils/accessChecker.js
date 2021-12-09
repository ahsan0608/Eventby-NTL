/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/utils/accessChecker.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 13th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

const models = require("../models");

module.exports = () => {
  return async (req, res, next) => {
    try {
      const eventId = req.params.id;

      await models.Event.find({
        _id: eventId,
      })
        .then(function (event) {
          const isAmin = event[0].admin.includes(req.user.id);
          if (!isAmin) {
            res.status(403).json({
              success: false,
              message: "You don't have privilege to perform this action!",
            });
            return;
          }
          next();
        })
        .catch(function (err) {
          res.status(405).send(err);
        });
    } catch (error) {
      next(error);
    }
  };
};
