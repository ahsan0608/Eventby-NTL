const passport = require("passport");
const homeRouters = require("../routes/home.routers");
const userRouters = require("../routes/user.routers");
const eventRouters = require("../routes/event.routers");
const authRouters = require('../routes/auth.routers');

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
