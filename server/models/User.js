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

function validateUser(user) {
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

module.exports = mongoose.model("User", UserSchema);
module.exports.validate = validateUser;
