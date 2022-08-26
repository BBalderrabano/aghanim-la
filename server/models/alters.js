const mongoose = require("mongoose");

const alterSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    itemlevel: {
      type: Number,
    },
    laclass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      autopopulate: true
    },
    enabled: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alter", alterSchema);
