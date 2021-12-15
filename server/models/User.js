/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/models/User.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 18th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) @BRL
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");
const saltRounds = 10;

const UserSchema = new mongoose.Schema(
  {
    googleId: String,
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      minlength: 6,
      maxlength: 255,
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 255,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "organizer"],
    },
    createdEvents: [{ type: mongoose.Types.ObjectId, ref: "Event" }],
    likedEvents: [{ type: mongoose.Types.ObjectId, ref: "Event" }],
    invitedAt: [{ type: mongoose.Types.ObjectId, ref: "Event" }],
    receivedInvitation: [{ type: mongoose.Types.ObjectId, ref: "Event" }],
    paymentHistory: [{ type: mongoose.Types.ObjectId, ref: "Payment" }],
  },
  {
    timestamps: true,
  }
);

UserSchema.methods = {
  matchPassword: function (password) {
    return bcrypt.compare(password, this.password);
  },
};

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) {
          next(err);
          return;
        }
        this.password = hash;
        next();
      });
    });
    return;
  }
  next();
});

function validateUserRegistration(user) {
  const schema = Joi.object({
    firstName: Joi.string()
      .alphanum()
      .regex(/[a-zA-Z]/)
      .required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: new PasswordComplexity({
      min: 8,
      max: 25,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4,
    }),
  });

  return schema.validate(user);
}

function validateUserLogin(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
}

function validateUserForgotPassword(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  return schema.validate(user);
}

function validateUserResetPassword(pass) {
  const passwordObj = {
    newPassword: pass.newPassword,
    repeatPassword: pass.repeatPassword,
  };
  const schema = Joi.object({
    newPassword: new PasswordComplexity({
      min: 8,
      max: 25,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4,
    }),
    repeatPassword: new PasswordComplexity({
      min: 8,
      max: 25,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4,
    }),
  });

  return schema.validate(passwordObj);
}

async function bcryptPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds);
  let myhashPass = await bcrypt.hash(password, salt);
  return myhashPass;
}

module.exports = mongoose.model("User", UserSchema);
module.exports.validateRegistration = validateUserRegistration;
module.exports.validateLogin = validateUserLogin;
module.exports.validateUserForgotPassword = validateUserForgotPassword;
module.exports.validateUserResetPassword = validateUserResetPassword;
module.exports.bcryptPassword = bcryptPassword;
