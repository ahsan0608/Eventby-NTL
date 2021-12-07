const passport = require("passport");

const controllers = require("../controllers/");
const router = require("express").Router();
const { auth } = require("../utils");

router.get("/", auth(), controllers.user.get.all);

router.get("/:id", auth(), controllers.user.get.one);

router.post("/register", controllers.user.post.register);

router.post("/activeAccount/:token", controllers.user.post.activeAccount);

router.post("/login", controllers.user.post.login);

router.post("/logout", controllers.user.post.logout);

router.delete("/:id", controllers.user.delete);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failure" }),
  function (req, res) {
    // Successful authentication, redirect success
    console.log("SUCCESSFULL");
    res.redirect("/success");
  }
);

router.get("/success", (req, res) => {
  res.send("Succeed");
});

router.get("/failure", (req, res) => {
  res.send("Something went wrong..");
});

module.exports = router;
