/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/config/routes.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 18th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

const passport = require("passport");
const homeRouters = require("../routes/home.routers");
const userRouters = require("../routes/user.routers");
const eventRouters = require("../routes/event.routers");
const authRouters = require("../routes/auth.routers");

module.exports = (app) => {
  app.use("/", homeRouters);
  app.use("/user", userRouters);
  app.use("/event", eventRouters);

  // app.use('/auth', authRouters);

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/events");
    }
  );

  app.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.use("*", (req, res, next) =>
    res.send("<h1> Something went wrong. Try again. :thumbsup: </h1>")
  );
};
