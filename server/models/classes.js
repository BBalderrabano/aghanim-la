const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    classname: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    parentname : {
        type: String,
        required: true,
        trim: true
      },
    active: {
      type: Boolean,
      default: false,
    }
  }
);

module.exports = mongoose.model("Class", classSchema);