/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/routes/event.routers.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 18th 2021, 11:07:57 am
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

const controllers = require("../controllers/");
const router = require("express").Router();
const { auth, privilege, ticketChecker } = require("../utils");
const joiMiddleware = require("../middleWares/joiMiddleware");
const { schemasREvent } = require("../models/REvent");

router.get("/", controllers.event.get.all);

router.get("/details/:id", auth(), controllers.event.get.details);

router.post("/create", auth(), controllers.event.post.create);

router.post("/:id/ticket", auth(), privilege(), controllers.event.post.ticket);

router.post("/:id/checkout", auth(), controllers.event.post.stripeBilling);

router.post(
  "/join/:id",
  auth(),
  ticketChecker(),
  controllers.event.post.joinEvent
);

router.get(
  "/:id/participants",
  auth(),
  privilege(),
  controllers.event.get.participantList
);

router.get("/my-invitations", auth(), controllers.event.get.myInvitations);

router.put("/like/:id", auth(), controllers.event.put.like);

router.put("/dislike/:id", auth(), controllers.event.put.dislike);

router.put("/edit/:id", auth(), privilege(), controllers.event.put.editEvent);

router.put(
  "/addCoOrganizer/:id",
  auth(),
  privilege(),
  controllers.event.put.addCoOrganizer
);

router.post(
  "/addSpeaker/:id",
  auth(),
  privilege(),
  controllers.event.post.addSpeaker
);

router.post(
  "/addSponsor/:id",
  auth(),
  privilege(),
  controllers.event.post.addSponsor
);

router.post(
  "/invite/:id",
  auth(),
  privilege(),
  controllers.event.post.sendInvitation
);

router.get("/events/:eventId/:choice", controllers.event.get.mailResponse);

router.delete(
  "/delete/event:id",
  auth(),
  privilege(),
  controllers.event.delete.deleteEvent
);

router.delete(
  "/delete/sponsor/:id",
  auth(),
  privilege(),
  controllers.event.delete.deleteSponsor
);

//Shafayet
router.post(
  "/create-revent/:id",
  auth(),
  privilege(),
  joiMiddleware(schemasREvent, "body"),
  controllers.event.post.createEventOrganizer
);
router.get("/get-revents", controllers.event.get.getREventsOrganizer);
router.get("/get-revent/:id", controllers.event.get.getREventByIdOrganizer);
router.get("/get-revent-status/:id", controllers.event.get.getREventStatusById);
router.put(
  "/update-revent/:id",
  controllers.event.put.updateREventByIdOrganizer
);
router.delete(
  "/delete-revent/:id",
  controllers.event.deleteREventByIdOrganizer
);

module.exports = router;
