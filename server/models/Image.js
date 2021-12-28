const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    image: {
      data: Buffer,
      contentType: String,
      description: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Image", imageSchema);
