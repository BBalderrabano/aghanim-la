const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    itemlevel: {
      type: Number,
      required: true,
    },
    laclass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      autopopulate: true
    },
    hashedPassword: {
      type: String
    },
    preaproved: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: true
    },
    roles: {
      type: [Number],
      default: [2001]
    },
    salt: String,
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(require('mongoose-autopopulate'));

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");

  this.hashedPassword = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
};

userSchema.methods.validPassword = function (password) {
  var hashedPassword = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return this.hashedPassword === hashedPassword;
};

module.exports = mongoose.model("User", userSchema);
