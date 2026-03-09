const mongoose = require("mongoose");
const getNextSequence = require("../utils/sequence");

const interviewModeSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    mode_name: { type: String, required: true, unique: true, trim: true }
  },
  {
    collection: "interview_modes",
    versionKey: false
  }
);

interviewModeSchema.pre("save", async function assignId(next) {
  if (!this.isNew || this.id) return next();
  this.id = await getNextSequence("interview_modes");
  return next();
});

module.exports = mongoose.model("InterviewMode", interviewModeSchema);
