const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    seq: { type: Number, default: 0 }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Counter", counterSchema);
