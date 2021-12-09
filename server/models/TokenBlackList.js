/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/models/TokenBlackList.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 24th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

const mongoose = require("mongoose");

const TokenBlacklist = new mongoose.Schema(
  {
    token: String,
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("TokenBlacklist", TokenBlacklist);
