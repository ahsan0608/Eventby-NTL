const mongoose = require("mongoose");
const models = require("../models");
const keys = require("../config/keys");
const stripe = require("stripe")(keys.SPRIPE_SECRET);
var creditCardType = require("credit-card-type");
const { sendEventInvitation } = require("../utils/mail/mailer");
const { getRecurrentEventDates } = require("../helpers");
const { isGreaterToCurrentDate } = require("../helpers/schedulerJobs");
const { REvent } = require("../models/REvent");

module.exports = {
  get: {
    all: (req, res, next) => {
      const limit = Number(req.query.limit);

      if (limit) {
        models.Event.find()
          .sort("name")
          .limit(limit)
          .exec(function (err, events) {
            res.send(events);
          });
      } else {
        models.Event.find()
          .then((events) => res.send(events))
          .catch(next);
      }
    },
    details: (req, res, next) => {
      const id = req.params.id;

      models.Event.findById(id)
        .populate({
          path: "ticket",
          populate: {
            path: "custom_ticket",
            model: "CustomTicket",
          },
        })
        .populate({
          path: "event_type_details",
          model: "EventTypeDetails",
        })
        .exec((err, data) => res.send(data));
    },
    mailResponse: (req, res, next) => {
      res.send("Thanks for voting!");
    },
    getREventsOrganizer: (req, res, next) => {
      try {
        REvent.find().then((result) => {
          console.log(result);
          return res.status(200).json({
            data: result,
            success: true,
            message: "Success",
          });
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "An error occurred",
        });
      }
    },
    getREventByIdOrganizer: (req, res, next) => {
      try {
        const id = req.params.id;
        // console.log(id);
        REvent.findOne({ _id: id }).then((result) => {
          console.log(result);
          return res.status(200).json({
            data: result,
            success: true,
            message: "Success",
          });
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "An error occurred",
        });
      }
    },
    getREventStatusById: (req, res, next) => {
      try {
        const event_id = mongoose.Types.ObjectId(req.params.id);

        models.Event.findOne({ _id: event_id })
          .populate("recurring_event")
          .then((result) => {
            let next_event_date = [];
            if (result.event_status === "EVENT_CREATED") {
              return res.status(200).json({
                data: {
                  _id: result._id,
                  event_status: result.event_status,
                  message: "Event is created but not start yet",
                },
                success: true,
                message: "Success",
              });
            } else if (result.event_status === "EVENT_END") {
              return res.status(200).json({
                data: {
                  _id: result._id,
                  event_status: result.event_status,
                  message: "Event is finished",
                },
                success: true,
                message: "Success",
              });
            } else {
              let recurring_dates = result.recurring_event.rEventDates;
              next_event_date = recurring_dates.filter(
                (element) => isGreaterToCurrentDate(element.startDate) !== true
              );

              return res.status(200).json({
                data: {
                  _id: result._id,
                  event_status: result.event_status,
                  next_event_date: next_event_date[0],
                  message: "Event is running",
                },
                success: true,
                message: "Success",
              });
            }
          });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "An error occurred",
        });
      }
    },
    participantList: (req, res, next) => {
      const eventId = req.params.id;

      models.Event.findById(eventId)
        .populate({
          path: "participant",
          model: "User",
        })
        .then((eventObj) => {
          var participants = [];
          eventObj.participant.map((participant) => {
            let result = {
              id: participant._id,
              firstName: participant.firstName,
              lastName: participant.lastName,
              email: participant.email,
            };
            participants.push(result);
          });
          res.status(200).json({
            success: true,
            message: "Event participant list",
            participants,
          });
        });
    },
    myInvitations: (req, res, next) => {
      const userId = req.user.id;

      models.User.findById(userId)
        .populate({
          path: "invitedAt",
          model: "Event",
        })
        .then((userObj) => {
          var invitations = [];
          userObj.invitedAt.map((invitedEvent) => {
            let result = {
              id: invitedEvent._id,
              event_name: invitedEvent.name,
              description: invitedEvent.description,
              event_type: invitedEvent.event_type,
            };
            invitations.push(result);
          });
          res.status(200).json({
            success: true,
            message: "My invitations list",
            invitations,
          });
        });
    },
  },

  post: {
    create: async (req, res, next) => {
      const {
        description,
        location,
        name,
        date,
        event_address_line1,
        event_address_line2,
        event_country,
        event_city_town,
        event_state,
        event_postal_code,
        imageURL,
        event_type,
        event_platform,
        event_platform_link,
      } = req.body;
      const { _id } = req.user;

      await models.User.find({
        _id: req.user.id,
      })
        .then(function (user) {
          const userCurrentRole = user[0].role;
          if (userCurrentRole == "user") {
            models.User.updateOne(
              { _id: req.user.id },
              {
                $set: {
                  role: "organizer",
                },
              },
              { new: true }
            ).then(async (updatedUser) => {
              await models.EventTypeDetails.create({
                event_location: location,
                event_address_line1,
                event_address_line2,
                event_country,
                event_city_town,
                event_state,
                event_postal_code,
                event_platform,
                event_platform_link,
              }).then((eventTypeDetailsObj) => {
                models.Event.create({
                  description,
                  name,
                  event_type_details: eventTypeDetailsObj,
                  event_type,
                  date,
                  imageURL,
                  admin: _id,
                }).then(function (eventObj) {
                  res.status(200).json({
                    success: true,
                    message: "Successfully saved!",
                    eventObj,
                  });
                });
              });
            });
          } else {
            models.EventTypeDetails.create({
              event_location: location,
              event_address_line1,
              event_address_line2,
              event_country,
              event_city_town,
              event_state,
              event_postal_code,
              event_platform,
              event_platform_link,
            }).then((eventTypeDetailsObj) => {
              models.Event.create({
                description,
                name,
                event_type_details: eventTypeDetailsObj,
                event_type,
                date,
                imageURL,
                admin: _id,
              }).then(function (eventObj) {
                res.status(200).json({
                  success: true,
                  message: "Successfully saved!",
                  eventObj,
                });
              });
            });
          }
        })
        .catch(next);
    },
    ticket: async (req, res, next) => {
      const event_id = req.params.id;
      const {
        ticket_type,
        custom_ticket,
        sale_start_date,
        sale_start_time,
        sale_end_date,
        sale_end_time,
      } = req.body;

      const eventObj = await models.Event.findOne({
        _id: event_id,
      });

      if (eventObj.ticket != null) {
        return res.status(400).json({
          success: false,
          message: "You have already save ticket for this event!",
        });
      }

      const { _id } = req.user;

      if (ticket_type == "free") {
        models.Ticket.create({
          ticket_type,
          sale_start_date,
          sale_start_time,
          sale_end_date,
          sale_end_time,
          event: event_id,
        })
          .then((createdticket) => {
            models.Event.updateOne(
              { _id: event_id },
              {
                $set: {
                  ticket: createdticket,
                },
              },
              { new: true }
            ).then(function (updatedEvent) {
              res.status(200).json({
                success: true,
                message: "Successfully saved ticket!",
                updatedEvent,
              });
            });
          })
          .catch(next);
      } else if (ticket_type == "paid") {
        models.Ticket.create({
          ticket_type,
          sale_start_date,
          sale_start_time,
          sale_end_date,
          sale_end_time,
          event: event_id,
        })
          .then(async (createdticket) => {
            await custom_ticket.map((custom_tic) => {
              return Promise.all([
                models.CustomTicket.create({
                  name: custom_tic.name,
                  price: custom_tic.price,
                  currency: custom_tic.currency,
                }).then((customticket) => {
                  models.Ticket.updateOne(
                    { _id: createdticket._id },
                    { $push: { custom_ticket: customticket } }
                  ).then(() => {
                    next();
                  });
                }),
              ]);
            });

            await models.Event.updateOne(
              { _id: event_id },
              {
                $set: {
                  ticket: createdticket,
                },
              },
              { new: true }
            ).then((updatedEventTicket) => {
              res.status(200).json({
                success: true,
                message: "Successfully updated event!",
                updatedEventTicket,
              });
            });
          })
          .catch(next);
      } else {
        res.status(200).json({
          success: true,
          message: "You have to specify ticket type free of paid!",
          updatedEvent,
        });
      }
    },
    stripeBilling: async (req, res, next) => {
      const event_id = req.params.id;
      const {
        cardNumber,
        cardExpMonth,
        cardExpYear,
        cardCVC,
        country,
        postalCode,
        amount,
        ticketId,
        email,
      } = req.body;

      if (
        !cardNumber ||
        !cardExpMonth ||
        !cardExpYear ||
        !cardCVC ||
        !ticketId ||
        !amount ||
        !email
      ) {
        return res.status(400).json({
          success: false,
          message: "Necessary Card Details are required for One Time Payment",
        });
      }

      const paymentObj = await models.Payment.findOne({
        event: event_id,
        user: req.user.id,
      }).lean();

      if (paymentObj) {
        return res.status(400).json({
          success: false,
          message: `You have already pay for this event`,
        });
      }

      const customTicketObj = await models.CustomTicket.find({
        _id: ticketId,
      });
      const ticketPrice = customTicketObj[0].price;

      if (ticketPrice != amount) {
        return res.status(400).json({
          success: false,
          message: `You have to pay ${ticketPrice} for the ticket`,
        });
      }

      try {
        const cardToken = await stripe.tokens.create({
          card: {
            number: cardNumber,
            exp_month: cardExpMonth,
            exp_year: cardExpYear,
            cvc: cardCVC,
            address_state: country,
            address_zip: postalCode,
          },
        });

        const charge = await stripe.charges.create({
          amount: amount,
          currency: "usd",
          source: cardToken.id,
          receipt_email: email,
          description: `Stripe Charge Of Amount ${amount} for One Time Payment`,
        });

        if (charge.status === "succeeded") {
          const chargeObj = { Success: charge };
          const stripePaymentId = chargeObj.Success.id;

          var cardType = creditCardType(cardNumber)[0].niceType;

          await models.Payment.create({
            paymentId: stripePaymentId,
            cardType: cardType,
            paymentThrough: "stripe",
            user: req.user.id,
            event: event_id,
          }).then(async (paymentObj) => {
            await models.User.updateOne(
              { _id: req.user.id },
              { $addToSet: { receivedInvitation: paymentObj.event } },
              { new: true }
            ).then(async (userObj) => {
              await models.User.updateOne(
                { _id: req.user.id },
                { $addToSet: { paymentHistory: paymentObj } },
                { new: true }
              ).then(() => {
                return res.status(200).json({
                  success: true,
                  message: "Payment successfull",
                });
              });
            });
          });
        } else {
          return res
            .status(400)
            .send({ Error: "Please try again later for One Time Payment" });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Can't proceed payment!",
          error,
        });
      }
    },
    sendInvitation: async (req, res, next) => {
      const eventId = req.params.id;

      if (req.body.hasOwnProperty("inviteeId")) {
        const { inviteeId } = req.body;

        const invitees = inviteeId.split(",");

        await invitees.map((invitee) => {
          return Promise.all([
            models.User.updateOne(
              { _id: invitee },
              { $addToSet: { invitedAt: eventId } }
            )
              .then(() => {
                models.Event.updateOne(
                  { _id: eventId },
                  { $addToSet: { invitee } }
                ).then((eventInviteeObj) => {
                  res.status(200).json({
                    success: true,
                    message: "Invitation has sent successfully!",
                    eventInviteeObj,
                  });
                });
              })
              .catch(next),
          ]);
        });
      } else {
        const { to, subject, body } = req.body;
        const eventId = req.params.id;

        await sendEventInvitation(to, subject, body, eventId).then(
          async (mailResp) => {
            if (mailResp) {
              const mailObj = await models.Mail.findOne({
                event: eventId,
              });

              if (mailObj != null) {
                await models.Mail.findOneAndUpdate(
                  { event: eventId },
                  { $addToSet: { to } }
                )
                  .then((eventMailObj) => {
                    models.Event.updateMany(
                      { _id: eventId },
                      { $push: { mail: eventMailObj } }
                    ).then((eventMailObj) => {
                      res.status(200).json({
                        success: true,
                        message: "Invitation has sent successfully!",
                        eventMailObj,
                      });
                    });
                  })

                  .catch(next);
              } else {
                await models.Mail.create({
                  subject,
                  body,
                  to,
                  event: eventId,
                  user_sender: req.user.id,
                  dateSent: Date.now(),
                })
                  .then((eventMailObj) => {
                    models.Event.updateMany(
                      { _id: eventId },
                      { $push: { mail: eventMailObj } }
                    ).then((eventMailObj) => {
                      res.status(200).json({
                        success: true,
                        message: "Invitation has sent successfully!",
                        eventMailObj,
                      });
                    });
                  })

                  .catch(next);
              }
            } else {
              return res.status(400).json({
                success: false,
                message:
                  "Error occured while sending mail! Recheck and try again.",
                error,
              });
            }
          }
        );
      }
    },

    joinEvent: async (req, res, next) => {
      const eventId = req.params.id;

      const eventObj = await models.Event.findOne({
        _id: eventId,
      });

      if (eventObj.participant.includes(req.user.id)) {
        return res.status(400).json({
          success: false,
          message: "You have already joined this event!",
        });
      }

      await models.Event.findOne({
        _id: eventId,
      })
        .then(async (eventObj) => {
          return Promise.all([
            await models.Event.updateOne(
              { _id: eventId },
              { $addToSet: { participant: req.user.id } },
              { new: true }
            ).then(async (eventObj) => {
              await models.User.updateOne(
                { _id: req.user.id },
                { $addToSet: { receivedInvitation: eventId } },
                { new: true }
              ).then(async (userObj) => {
                const userId = req.user.id;
                models.User.findById(userId).then((userObj) => {
                  if (userObj.invitedAt.includes(eventId)) {
                    models.User.updateOne(
                      { _id: userId },
                      { $pull: { invitedAt: eventId } },
                      { new: true }
                    ).then(() => {
                      console.log("User updated");
                    });
                  }
                });
                return res.status(200).json({
                  success: true,
                  message: "Congrats! Youn have joined the event!",
                  userObj,
                });
              });
            }),
          ]);
        })
        .catch((err) => {
          res.status(422).json({
            success: false,
            message: "Something went wrong! please try again!",
          });
        });
    },

    createEventOrganizer: async (req, res, next) => {
      try {
        const event_id = req.params.id;

        const eventObj = await models.Event.findOne({
          _id: event_id,
        });

        if (eventObj.recurring_event != null) {
          return res.status(400).json({
            success: false,
            message: "You have already save recurrent dates for this event!",
          });
        }

        getRecurrentEventDates(req.body).then((rEventData) => {
          // console.log(rEventData);

          const rEventDataWithEventId = {
            rEventDates: rEventData,
            eventId: event_id,
          };
          REvent.create(rEventDataWithEventId).then((createdReevent) => {
            // console.log(createdReevent);

            models.Event.updateOne(
              { _id: event_id },
              {
                $set: {
                  recurring_event: createdReevent,
                },
              },
              { new: true }
            ).then(function (updatedReevent) {
              if (updatedReevent) {
                // console.log("Recurrent Event Created Successfully");
                res.status(200).json({
                  success: true,
                  message: "Successfully saved reevent!",
                  updatedReevent,
                });
              }
            });
          });
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "An error occurred",
        });
      }
    },
  },

  put: {
    edit: async (req, res, next) => {
      const id = req.params.id;
      const { name, description, imageURL, date, location } = req.body;
      await models.Event.findByIdAndUpdate(
        id,
        {
          name,
          description,
          imageURL,
          date,
          location,
        },
        { new: true }
      )
        .then((updatedEvent) => {
          res.status(200).json({
            success: true,
            message: "Successfully updates!",
            updatedEvent,
          });
        })
        .catch(next);
    },
    like: (req, res, next) => {
      const id = req.params.id;
      const { _id } = req.user;

      models.Event.findByIdAndUpdate(id, { $push: { likes: _id } })
        .then((updatedEvent) => {
          return Promise.all([
            models.User.findByIdAndUpdate(_id, { $push: { likedEvents: id } }),
            models.Event.findOne({ _id: updatedEvent._id }),
          ]);
        })
        .then(([userObj, eventObj]) =>
          res.status(200).json({
            success: true,
            message: "Liked!",
            eventObj,
          })
        )
        .catch(next);
    },
    dislike: (req, res, next) => {
      const id = req.params.id;
      const { _id } = req.user;

      models.Event.findByIdAndUpdate(id, { $pull: { likes: _id } })
        .then((updatedEvent) => {
          return Promise.all([
            models.User.findByIdAndUpdate(_id, { $pull: { likedEvents: id } }),
            models.Event.findOne({ _id: updatedEvent._id }),
          ]);
        })
        .then(([userObj, eventObj]) =>
          res.status(200).json({
            success: true,
            message: "Unliked!",
            eventObj,
          })
        )
        .catch(next);
    },
    addCoOrganizer: async (req, res, next) => {
      const eventId = req.params.id;
      const { coOrganizerId } = req.body;
      await models.User.findById(coOrganizerId).then((coOrganizer) => {
        models.Event.updateOne(
          { _id: eventId },
          { $push: { admin: coOrganizer } },
          { new: true }
        )
          .then((updatedEventCoOrg) =>
            res.status(200).json({
              success: true,
              message: "Co organizer added successfully!",
              updatedEventCoOrg,
            })
          )
          .catch(next);
      });
    },
    updateREventByIdOrganizer: async (req, res, next) => {
      try {
        getRecurrentEventDates(req.body).then((rEventData) => {
          // console.log(rEventData);

          const id = req.params.id;
          // console.log(id);
          REvent.findOneAndUpdate(
            { _id: id },
            { rEventDates: rEventData }
          ).then((result) => {
            // console.log(result);
            return res.status(200).json({
              data: result,
              success: true,
              message: "Success",
            });
          });
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "An error occurred",
        });
      }
    },
  },

  delete: (req, res, next) => {
    const id = req.params.id;
    const { _id } = req.user;

    models.Event.deleteOne({ _id: id })
      .then((deletedEvent) => {
        return Promise.all([
          models.User.updateOne({ _id }, { $pull: { createdEvents: id } }),
          models.Event.findOne({ _id: deletedEvent._id }),
        ]);
      })
      .then(([obj, deletedEvent]) =>
        res.status(200).json({
          success: true,
          message: "Successfully deleted!",
          deletedEvent,
        })
      )
      .catch(next);
  },

  deleteREventByIdOrganizer: (req, res, next) => {
    try {
      const id = req.params.id;

      REvent.findOneAndDelete({ _id: id }).then((result) => {
        console.log(result);
        return res.status(200).json({
          success: true,
          message: "Successfully Deleted",
        });
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred",
      });
    }
  },
};
