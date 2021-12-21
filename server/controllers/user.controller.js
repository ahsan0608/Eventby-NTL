/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/controllers/user.controller.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 19th 2021, 9:15:11 am
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

require("dotenv").config();
const jwt = require("jsonwebtoken");
const models = require("../models");
const utils = require("../utils");
const keys = require("../config/keys");
const bcrypt = require("bcrypt");
const { sendMailForUserVerification } = require("../utils/mail/mailer");
const { sendMailForPasswordReset } = require("../utils/mail/mailer");
const { validateRegistration } = require("../models/User");
const { validateLogin } = require("../models/User");
const { validateUserForgotPassword } = require("../models/User");
const { validateUserResetPassword } = require("../models/User");
const { bcryptPassword } = require("../models/User");

module.exports = {
  get: {
    all: (req, res, next) => {
      models.User.find()
        .then((users) => res.send(users))
        .catch(next);
    },
    one: (req, res, next) => {
      const { _id } = req.user;

      models.User.findById(_id).exec(function (err, result) {
        if (err) {
          return res.status(400).json({
            success: false,
            message: err,
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "Successfully retrieve data!",
            result,
          });
        }
      });
    },
  },

  post: {
    register: (req, res, next) => {
      const { googleId, firstName, lastName, email, password, role } = req.body;

      const { error } = validateRegistration(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      } else {
        models.User.findOne({ email }).exec(async (err, user) => {
          if (user) {
            return res.status(400).json({
              success: false,
              message: "User with this email already exists!",
            });
          } else {
            const token = jwt.sign(
              {
                googleId,
                firstName,
                lastName,
                email,
                password,
                role,
              },
              keys.JWT_ACTIVE_ACC_SEC,
              { expiresIn: "20m" }
            );

            await sendMailForUserVerification(email, token).then((mailResp) => {
              if (mailResp) {
                return res.status(200).json({
                  success: true,
                  message: "Successfully send email for verification!",
                });
              } else {
                return res.status(400).json({
                  success: false,
                  message:
                    "Error occured while sending mail! Recheck and try again.",
                  error,
                });
              }
            });
          }
        });
      }
    },

    activeAccount: (req, res, next) => {
      const token = req.params.token;
      if (token) {
        jwt.verify(
          token,
          keys.JWT_ACTIVE_ACC_SEC,
          async function (err, decodedToken) {
            if (err) {
              res.status(400).json({
                success: false,
                message: "Incorrect link!",
              });
            }
            const { googleId, firstName, lastName, email, password, role } =
              decodedToken;
            await models.User.create({
              googleId: googleId || "",
              firstName,
              lastName,
              email,
              password,
              role: role || "user",
            })
              .then((createdUser) => {
                const token = utils.jwt.createToken({ id: createdUser._id });
                res.cookie(process.env.COOKIE, token).status(200).json({
                  success: true,
                  message:
                    "Email verification successful! Please login to continue.",
                });
              })
              .catch(next);
          }
        );
        return;
      }
    },

    login: (req, res, next) => {
      const { email, password } = req.body;

      const { error } = validateLogin(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      } else {
        models.User.findOne({ email })
          .then((user) =>
            !!user
              ? Promise.all([user, user.matchPassword(password)])
              : [null, false]
          )
          .then(([user, match]) => {
            if (!match) {
              res.status(401).json({
                success: false,
                message: "Invalid email or password",
              });
              return;
            }

            let result = {
              id: user._id,
              googleId: user.googleId,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              createdEvents: user.createdEvents,
              likedEvents: user.likedEvents,
            };
            const token = utils.jwt.createToken({ id: user._id });
            res.cookie(process.env.COOKIE, token).status(200).json({
              success: true,
              message: "Successfully logged in!",
              result,
            });
          })
          .catch(next);
      }
    },

    forgotPassword: (req, res, next) => {
      const { email } = req.body;

      const { error } = validateUserForgotPassword(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      models.User.findOne({ email }).exec(async (err, user) => {
        if (user) {
          const token = jwt.sign(
            {
              email,
            },
            keys.JWT_ACTIVE_ACC_SEC,
            { expiresIn: "20m" }
          );

          await sendMailForPasswordReset(email, token).then((mailResp) => {
            if (mailResp) {
              return res.status(200).json({
                success: true,
                message: "Successfully send email to reset passward.",
              });
            } else {
              return res.status(400).json({
                success: false,
                message:
                  "Error occured while sending mail! Recheck and try again.",
                error,
              });
            }
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid email!",
            error,
          });
        }
      });
    },

    resetPassword: (req, res, next) => {
      const { newPassword, repeatPassword } = req.body;
      const token = req.params.token;
      if (token) {
        jwt.verify(
          token,
          keys.JWT_ACTIVE_ACC_SEC,
          async function (err, decodedToken) {
            if (err) {
              res.status(400).json({
                success: false,
                message: "Incorrect link!",
              });
            }

            const { error } = validateUserResetPassword(req.body);
            if (error) {
              return res.status(400).json({
                success: false,
                message: error.details[0].message,
              });
            }

            if (newPassword != repeatPassword) {
              return res.status(400).json({
                success: false,
                message: "Passwords didn't match!",
              });
            }

            const { email } = decodedToken;

            const hashPass = await bcryptPassword(newPassword);

            models.User.updateOne(
              { email },
              {
                $set: {
                  password: hashPass,
                },
              },
              { new: true }
            )
              .then(async (updatedUser) => {
                const token = utils.jwt.createToken({ id: updatedUser._id });
                res.cookie(process.env.COOKIE, token).status(200).json({
                  success: true,
                  message:
                    "Password reset successful! Please login to continue.",
                });
              })
              .catch(next);
          }
        );
        return;
      }
    },

    changePassword: (req, res, next) => {
      const { currentPassword, newPassword, repeatPassword } = req.body;
      const _id = req.user.id;

      models.User.findById(_id)
        .then((user) =>
          !!user
            ? Promise.all([user, user.matchPassword(currentPassword)])
            : [null, false]
        )
        .then(async ([user, match]) => {
          if (!match) {
            return res.status(401).json({
              success: false,
              message: "Check current password. Password doesn't match!",
            });
          }

          const { error } = validateUserResetPassword(req.body);
          if (error) {
            return res.status(400).json({
              success: false,
              message: error.details[0].message,
            });
          }

          if (newPassword != repeatPassword) {
            return res.status(400).json({
              success: false,
              message: "New passwords didn't match!",
            });
          }

          const hashPass = await bcryptPassword(newPassword);

          models.User.updateOne(
            { _id },
            {
              $set: {
                password: hashPass,
              },
            },
            { new: true }
          )
            .then(async (updatedUser) => {
              const token = utils.jwt.createToken({ id: updatedUser._id });
              res.cookie(process.env.COOKIE, token).status(200).json({
                success: true,
                message: "Password reset successful! Please login to continue.",
              });
            })
            .catch(next);
        });
    },

    logout: (req, res, next) => {
      const token = req.cookies[process.env.COOKIE];
      models.TokenBlacklist.create({ token })
        .then(() => {
          res.clearCookie(process.env.COOKIE).send("Logged out successfully!");
        })
        .catch(next);
    },
  },

  delete: (req, res, next) => {
    const id = req.params.id;
    models.User.deleteOne({ _id: id })
      .then((removedUser) => res.send(removedUser))
      .catch(next);
  },
};
