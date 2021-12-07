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
