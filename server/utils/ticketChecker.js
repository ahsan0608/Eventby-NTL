/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/utils/ticketChecker.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: December 5th 2021, 2:49:48 pm
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
        .then(async (event) => {
          await models.Ticket.find({
            _id: event[0].ticket,
          }).then((ticket) => {
            const ticket_type = ticket[0].ticket_type;
            if (ticket_type == "free") {
              next();
            } else {
              models.User.findOne({ _id: req.user.id }).then(
                async (userObj) => {
                  if (userObj.receivedInvitation.includes(eventId)) {
                    next();
                  } else {
                    return res.status(405).json({
                      success: false,
                      message: "You have to pay to participate this event!",
                    });
                  }
                }
              );
            }
          });
        })
        .catch(function (err) {
          res.status(405).json({
            success: false,
            message: "Something went wrong! please recheck!",
          });
        });
    } catch (error) {
      // next();
      res.status(405).json({
        success: false,
        message: "Something went wrong!",
        error,
      });
    }
  };
};
