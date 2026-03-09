const mongoose = require("mongoose");
const getNextSequence = require("../utils/sequence");

const interviewSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    interview_date: { type: Date, required: true },
    mode_id: { type: mongoose.Schema.Types.ObjectId, ref: "InterviewMode", required: true },
    location: { type: String, default: "" },
    application_id: { type: mongoose.Schema.Types.ObjectId, ref: "JobApplication", required: true },
    interview_time: { type: String, default: "" },
    meeting_link: { type: String, default: "" },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  {
    collection: "interviews",
    versionKey: false
  }
);

interviewSchema.pre("save", async function assignId(next) {
  if (!this.isNew || this.id) return next();
  this.id = await getNextSequence("interviews");
  return next();
});

module.exports = mongoose.model("Interview", interviewSchema);
