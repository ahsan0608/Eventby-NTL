/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/services/passport.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 8th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const models = require("../models");
const utils = require("../utils");

const COOKIE = "qwerasdasd";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, id);
  models.User.findById(id, (err, user) => done(err, user));
  // // models.User.findById(_id).then((user) => {
  // //     done(null, user);
  // // });
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "265353713951-ntd1m9f3uo2h1rdrv2i2a6s1eud3l84s.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
      };

      try {
        let user = await models.User.findOne({
          email: profile.emails[0].value,
        });

        if (user) {
          done(null, user);
        } else {
          user = await models.User.create(newUser);
          done(null, user);
        }
      } catch (err) {
        console.error(err);
      }
    }
  )
);
