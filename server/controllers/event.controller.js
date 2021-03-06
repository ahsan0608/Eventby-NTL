/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/controllers/event.controller.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 18th 2021, 3:47:51 pm
 * Author: ahsan
 *
 * Copyright (c) @BRL
 */

const mongoose = require("mongoose");
const models = require("../models");
const keys = require("../config/keys");
const stripe = require("stripe")(keys.SPRIPE_SECRET);
const path = require("path");
const fs = require("fs");
var creditCardType = require("credit-card-type");
const { sendEventInvitation } = require("../utils/mail/mailer");
const {
  getRecurrentEventDates,
  getNextEventDateAndTime,
} = require("../helpers");
const { isGreaterToCurrentDate } = require("../helpers/schedulerJobs");
const { REvent } = require("../models/REvent");
const notifier = require("node-notifier");
const { validateDate } = require("../models/Event");
const { validateEmailList } = require("../models/Event");
const { validateEvent } = require("../models/Event");
const { validateSpeaker } = require("../models/Speaker");
const { validateSponsor } = require("../models/Sponsor");
const { uploadSingleFile, uploadMultipleFiles } = require("../utils/upload");

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
    details: async (req, res, next) => {
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
        .populate({
          path: "speakers",
          model: "Speaker",
        })
        .populate({
          path: "sponsors",
          model: "Sponsor",
        })
        .then((eventObj) => {
          return res.status(200).json({
            success: true,
            message: "Success",
            data: eventObj,
          });
        })
        .catch((error) => {
          res.status(422).json({
            success: false,
            message: "Invalid data! Event not found!",
            error,
          });
        });
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
            let next_event_date_and_time = [];

            // ["EVENT_CREATED", "EVENT_RUNNING", "EVENT_PAUSE", "EVENT_END"]

            const nextEventDateTime = getNextEventDateAndTime(result);

            switch (result.event_status) {
              case "EVENT_CREATED":
                return res.status(200).json({
                  data: {
                    _id: result._id,
                    event_status: result.event_status,
                    next_event_date_and_time: nextEventDateTime,
                    message: "Event is created but not start yet",
                  },
                  success: true,
                  message: "Success",
                });
                break;
              case "EVENT_RUNNING":
                let recurring_dates = result.recurring_event.rEventDates;
                console.log(recurring_dates);
                next_event_date_and_time = recurring_dates.filter(
                  (element) =>
                    isGreaterToCurrentDate(element.startDate) === true
                );

                console.log(next_event_date_and_time);

                return res.status(200).json({
                  data: {
                    _id: result._id,
                    event_status: result.event_status,
                    next_event_date_and_time: nextEventDateTime,
                    message: "Event is running",
                  },
                  success: true,
                  message: "Success",
                });
                break;
              case "EVENT_PAUSE":
                return res.status(200).json({
                  data: {
                    _id: result._id,
                    event_status: result.event_status,
                    next_event_date_and_time: nextEventDateTime,
                    message: "Event is paused",
                  },
                  success: true,
                  message: "Success",
                });
                break;
              case "EVENT_END":
                return res.status(200).json({
                  data: {
                    _id: result._id,
                    event_status: result.event_status,
                    message: "Event is finished",
                  },
                  success: true,
                  message: "Success",
                });
                break;
              default:
                break;
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

      console.log("EventObj: " + eventId);

      models.Event.findById({ _id: eventId })
        .populate({
          path: "participant",
          model: "User",
        })
        .then((eventObj) => {
          var participants = [];
          eventObj.participant.map((participant) => {
            let result_participants = {
              id: participant._id,
              firstName: participant.firstName,
              lastName: participant.lastName,
              email: participant.email,
            };
            participants.push(result_participants);
          });
          res.status(200).json({
            success: true,
            message: "Success",
            data: { participants },
          });
        })
        .catch((error) => {
          res.status(422).json({
            success: false,
            message: "Something went wrong!",
            error,
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
            message: "Success",
            data: invitations,
          });
        })
        .catch((error) => {
          res.status(422).json({
            success: false,
            message: "Something went wrong!",
            error,
          });
        });
    },
    eventAdmins: (req, res, next) => {
      const eventId = req.params.id;

      console.log("EventObj: " + eventId);

      models.Event.findById({ _id: eventId })
        .populate({
          path: "organizer",
          model: "User",
        })
        .populate({
          path: "co_organizer",
          model: "User",
        })
        .then((eventObj) => {
          var organizers = [];
          var co_organizers = [];
          eventObj.organizer.map((organizer) => {
            let result_organizer = {
              id: organizer._id,
              firstName: organizer.firstName,
              lastName: organizer.lastName,
              email: organizer.email,
            };
            organizers.push(result_organizer);
          });
          eventObj.co_organizer.map((co_organizer) => {
            let result_coorganizer = {
              id: co_organizer._id,
              firstName: co_organizer.firstName,
              lastName: co_organizer.lastName,
              co_organizers: co_organizer.email,
            };
            co_organizers.push(result_coorganizer);
          });
          res.status(200).json({
            success: true,
            message: "Success",
            data: { organizers, co_organizers },
          });
        })
        .catch((error) => {
          res.status(422).json({
            success: false,
            message: "Something went wrong!",
            error,
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
        start_date,
        end_date,
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

      const { error } = validateEvent(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      } else {
        const dateValidation = validateDate(start_date, end_date);
        if (!dateValidation) {
          return res.status(400).json({
            success: false,
            message: "Invalid date. Please check the event date!",
          });
        }
      }

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
                  start_date,
                  end_date,
                  imageURL,
                  organizer: _id,
                }).then(function (eventObj) {
                  notifier.notify({
                    title: "Success!",
                    message: "Successfully created event!",
                    sound: true,
                  });
                  res.status(200).json({
                    success: true,
                    message: "Successfully saved!",
                    data: eventObj,
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
                start_date,
                end_date,
                imageURL,
                organizer: _id,
              }).then(async (eventObj) => {
                await models.User.updateOne(
                  { _id: req.user.id },
                  { $push: { createdEvents: eventObj } },
                  { new: true }
                ).then((userObj) => {
                  notifier.notify({
                    title: "Success!",
                    message: "Successfully created event!",
                    sound: true,
                  });
                  res.status(200).json({
                    success: true,
                    message: "Successfully saved!",
                    data: eventObj,
                  });
                });
              });
            });
          }
        })
        .catch((error) => {
          res.status(422).json({
            success: false,
            message: "Something went wrong!",
            error,
          });
        });
    },
    bannerUpload: async (req, res, next) => {
      const event_id = req.params.id;
      try {
        await uploadSingleFile(req, res);

        if (req.file == undefined) {
          return res.status(400).send({ message: "Please upload a file!" });
        }

        const obj = {
          img: {
            data: fs.readFileSync(
              path.join(__basedir + "/uploads/" + req.file.filename)
            ),
            contentType: "image/png",
          },
        };

        models.Event.updateOne(
          { _id: event_id },
          {
            $set: {
              event_banner: obj.img,
            },
          },
          { new: true }
        )
          .then((eventObj) => {
            return res.status(200).json({
              success: true,
              message: "Banner uploaded successful!",
              eventObj,
            });
          })
          .catch((error) => {
            res.status(422).json({
              success: false,
              message: "Invalid data! Event not found!",
              error,
            });
          });
      } catch (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
          return res.status(500).send({
            message: "File size cannot be larger than 2MB!",
          });
        }
        res.status(500).send({
          message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
      }
    },
    multipleImageUpload: async (req, res, next) => {
      try {
        await uploadMultipleFiles(req, res);

        Promise.all([
          req.files.map(async (file) => {
            const obj = {
              img: {
                data: fs.readFileSync(
                  path.join(__basedir + "/uploads/" + file.filename)
                ),
                contentType: "image/png",
              },
            };
            models.Image.create({
              image: obj.img,
            }).then((imageObj) => {
              // console.log("Image saved successfull! " + imageObj);
            });
          }),
        ])
          .then(res.status(200).json("files successfully uploaded"))
          .catch((e) => {
            res.status(500).json({
              message: "Something went wrong in /uploads/img",
              error: e,
            });
          });

        if (req.files.length <= 0) {
          return res.send(`You must select at least 1 file.`);
        }
      } catch (error) {
        console.log(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
          return res.send("Too many files to upload.");
        }
        return res.send(`Error when trying upload many files: ${error}`);
      }
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

      const dateValidation = validateDate(sale_start_date, sale_end_date);
      if (!dateValidation) {
        return res.status(400).json({
          success: false,
          message: "Invalid date. Please check the dates!",
        });
      }

      await models.Event.findOne({
        _id: event_id,
      })
        .then((eventObj) => {
          if (eventObj.ticket != null) {
            return res.status(400).json({
              success: false,
              message: "You have already save ticket for this event!",
            });
          }
        })
        .catch((error) => {
          res.status(422).json({
            success: false,
            message: "Invalid data! Event not found!",
            error,
          });
        });

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
                data: updatedEvent,
              });
            });
          })
          .catch((error) => {
            res.status(422).json({
              success: false,
              message: "Something went wrong! Please try again.",
              error,
            });
          });
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
                data: updatedEventTicket,
              });
            });
          })
          .catch((error) => {
            res.status(422).json({
              success: false,
              message: "Something went wrong! Please try again.",
              error,
            });
          });
      } else {
        res.status(200).json({
          success: true,
          message: "You have to specify ticket type free or paid!",
          data: updatedEvent,
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
            .json({ Error: "Something went wrong! Please try again later." });
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
        if (invitees.includes(req.user.id)) {
          res.status(422).json({
            success: false,
            message: "You can't send yourself an invitation!",
          });
        }

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
                    data: eventInviteeObj,
                  });
                });
              })
              .catch((error) => {
                res.status(422).json({
                  success: false,
                  message: "Something went wrong! Please try again.",
                  error,
                });
              }),
          ]);
        });
      } else {
        const { to, subject, body } = req.body;
        const eventId = req.params.id;

        console.log();
        if (!validateEmailList(to)) {
          return res.status(422).json({
            success: false,
            message:
              "Unable to send email! Please recheck invitee's email address!",
          });
        }

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
                        data: eventMailObj,
                      });
                    });
                  })
                  .catch((error) => {
                    res.status(422).json({
                      success: false,
                      message: "Something went wrong! Please try again.",
                      error,
                    });
                  });
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
                        data: eventMailObj,
                      });
                    });
                  })
                  .catch((error) => {
                    res.status(422).json({
                      success: false,
                      message: "Something went wrong! Please try again.",
                      error,
                    });
                  });
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

      await models.Event.findOne({
        _id: eventId,
      })
        .then((eventObj) => {
          if (eventObj.participant.includes(req.user.id)) {
            return res.status(400).json({
              success: false,
              message: "You have already joined this event!",
            });
          }
        })
        .catch((error) => {
          res.status(422).json({
            success: false,
            message: "Invalid data! Event not found!",
            error,
          });
        });

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
                  data: userObj,
                });
              });
            }),
          ]);
        })
        .catch((error) => {
          res.status(422).json({
            success: false,
            message: "Something went wrong! please try with valid data!",
            error,
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

        getRecurrentEventDates(req.body, event_id).then((rEventData) => {
          console.log(rEventData);

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
    addSpeaker: async (req, res, next) => {
      const eventId = req.params.id;
      const { firstName, lastName, email } = req.body;

      const { error } = validateSpeaker(req.body);

      const speakerObj = await models.Speaker.findOne({
        email: email,
      });

      if (speakerObj != null) {
        await models.Event.findOne({
          _id: eventId,
        })
          .then((eventObj) => {
            if (eventObj.speakers.includes(speakerObj._id)) {
              res.status(422).json({
                success: false,
                message:
                  "You have already assigned user with this email as a speaker for this event!!",
              });
            }
          })
          .catch((error) => {
            res.status(422).json({
              success: false,
              message: "Something went wrong! Please try again.",
              error,
            });
          });
      }

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      await models.Speaker.findOne({ email })
        .then(async (speakerObj) => {
          if (speakerObj == null) {
            await models.Speaker.create({
              firstName,
              lastName,
              email,
            })
              .then((newSpeakerObj) => {
                models.Event.updateOne(
                  { _id: eventId },
                  {
                    $addToSet: {
                      speakers: newSpeakerObj,
                    },
                  },
                  { new: true }
                ).then((updatedEvent) => {
                  res.status(200).json({
                    success: true,
                    message: "Successfully saved speaker!",
                    data: updatedEvent,
                  });
                });
              })
              .catch((error) => {
                res.status(422).json({
                  success: false,
                  message: "Something went wrong! Please try again.",
                  error,
                });
              });
          } else {
            models.Event.updateOne(
              { _id: eventId },
              {
                $addToSet: {
                  speakers: speakerObj,
                },
              },
              { new: true }
            ).then((updatedEvent) => {
              res.status(200).json({
                success: true,
                message: "Successfully saved speaker!",
                data: updatedEvent,
              });
            });
          }
        })
        .catch((error) => {
          res.status(422).json({
            success: false,
            message: "Something went wrong! Please try again.",
            error,
          });
        });
    },
    addSponsor: async (req, res, next) => {
      const eventId = req.params.id;
      const { name, website } = req.body;

      const { error } = validateSponsor(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      await models.Sponsor.findOne({ name })
        .then(async (sponsorObj) => {
          if (sponsorObj == null) {
            await models.Sponsor.create({
              name,
              website,
            })
              .then((newSponsorObj) => {
                models.Event.updateOne(
                  { _id: eventId },
                  {
                    $addToSet: {
                      sponsors: newSponsorObj,
                    },
                  },
                  { new: true }
                ).then((updatedEvent) => {
                  res.status(200).json({
                    success: true,
                    message: "Successfully saved sponsor!",
                    data: updatedEvent,
                  });
                });
              })
              .catch((error) => {
                res.status(422).json({
                  success: false,
                  message: "Something went wrong! Please try again.",
                  error,
                });
              });
          } else {
            models.Event.updateOne(
              { _id: eventId },
              {
                $addToSet: {
                  sponsors: sponsorObj,
                },
              },
              { new: true }
            ).then((updatedEvent) => {
              res.status(200).json({
                success: true,
                message: "Successfully saved sponsor!",
                data: updatedEvent,
              });
            });
          }
        })
        .catch(next);
    },
  },

  put: {
    editEvent: async (req, res, next) => {
      const event_id = req.params.id;
      const {
        description,
        location,
        name,
        start_date,
        end_date,
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
      const dateValidation = validateDate(start_date, end_date);
      if (!dateValidation) {
        return res.status(400).json({
          success: false,
          message: "Invalid date. Please check the event date!",
        });
      }
      await models.Event.findByIdAndUpdate(
        { _id: event_id },
        {
          name,
          description,
          imageURL,
          start_date,
          end_date,
        },
        { new: true }
      )
        .then(async (updatedEvent) => {
          await models.EventTypeDetails.findByIdAndUpdate(
            { _id: updatedEvent.event_type_details._id },
            {
              event_location: location,
              event_address_line1,
              event_address_line2,
              event_country,
              event_city_town,
              event_state,
              event_postal_code,
              event_platform,
              event_platform_link,
            },
            { new: true }
          ).then((eventTypeDetailsObj) => {
            res.status(200).json({
              success: true,
              message: "Successfully updates!",
              data: updatedEvent,
            });
          });
        })
        .catch((error) => {
          res.status(422).json({
            success: false,
            message: "Something went wrong! Please try again.",
            error,
          });
        });
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

      const eventObj = await models.Event.findOne({
        _id: eventId,
      });

      if (eventObj != null) {
        if (eventObj.co_organizer.includes(coOrganizerId)) {
          return res.status(422).json({
            success: false,
            message:
              "You have already assigned this user as co-organizer for this event!!",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "Error while finding event!",
        });
      }

      await models.User.findById(coOrganizerId)
        .then((coOrganizerObj) => {
          models.Event.updateOne(
            { _id: eventId },
            { $push: { co_organizer: coOrganizerObj } },
            { new: true }
          )
            .then((updatedEventObj) => {
              models.User.updateOne(
                { _id: coOrganizerObj._id },
                {
                  $set: {
                    role: "co-organizer",
                  },
                },
                { new: true }
              ).then((updatedEventCoOrg) => {
                res.status(200).json({
                  success: true,
                  message: "Co organizer added successfully!",
                  updatedEventCoOrg,
                });
              });
            })
            .catch(next);
        })
        .catch((error) => {
          res.status(422).json({
            success: false,
            message: "Invalid Co-organizer! Please try again!",
            error,
          });
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

  delete: {
    deleteEvent: (req, res, next) => {
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
            data: deletedEvent,
          })
        )
        .catch((error) => {
          res.status(422).json({
            success: false,
            message: "Something went wrong! Please try again.",
            error,
          });
        });
    },
    deleteSponsor: (req, res, next) => {
      const eventId = req.params.id;
      const { sponsor_id } = req.body;

      models.Sponsor.deleteOne({ _id: sponsor_id })
        .then(async (deletedSponsor) => {
          console.log(deletedSponsor);
          await models.Event.updateOne(
            { _id: eventId },
            { $pull: { sponsors: sponsor_id } }
          ).then((deletedSponsor) =>
            res.status(200).json({
              success: true,
              message: "Successfully deleted!",
              data: deletedSponsor,
            })
          );
        })
        .catch((error) => {
          res.status(422).json({
            success: false,
            message: "Something went wrong! Please try again.",
            error,
          });
        });
    },
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
