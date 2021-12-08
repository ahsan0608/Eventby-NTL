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

router.put("/edit/:id", auth(), privilege(), controllers.event.put.edit);

router.put(
  "/addCoOrganizer/:id",
  auth(),
  privilege(),
  controllers.event.put.addCoOrganizer
);

router.post(
  "/invite/:id",
  auth(),
  privilege(),
  controllers.event.post.sendInvitation
);

router.get("/events/:eventId/:choice", controllers.event.get.mailResponse);

router.delete("/delete/:id", auth(), privilege(), controllers.event.delete);

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
