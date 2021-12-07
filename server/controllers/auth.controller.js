const passport = require("passport");
const models = require('../models');

module.exports = {
    get: {
        googleProfile: (req, res, next) => {
            passport.authenticate("google", {
                scope: ["profile", "email"],
            })
        },
        googleCallback: (req, res, next) => {
            passport.authenticate("google"),
                (req, res) => {
                    res.redirect("/events");
                }
        }
    }
};