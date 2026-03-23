const mongoose = require("mongoose");
const getNextSequence = require("../utils/sequence");

const applicationSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    company_name: { type: String, required: true, trim: true },
    job_role: { type: String, required: true, trim: true },
    status_id: { type: mongoose.Schema.Types.ObjectId, ref: "ApplicationStatus", required: true },
    resume_url: { type: String, required: true, trim: true },
    applicant_name: { type: String, trim: true },
    applicant_email: { type: String, trim: true, lowercase: true },
    cover_letter: { type: String, trim: true },
    applied_date: { type: Date, required: true },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  {
    collection: "job_applications",
    versionKey: false
  }
);

applicationSchema.pre("save", async function assignId(next) {
  if (!this.isNew || this.id) return next();
  this.id = await getNextSequence("job_applications");
  return next();
});

module.exports = mongoose.model("JobApplication", applicationSchema);
