const mongoose = require("mongoose");
const getNextSequence = require("../utils/sequence");

const jobSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    jobType: {
      type: String,
      enum: ["Full Time", "Internship", "Remote"],
      default: "Full Time"
    },
    shortDescription: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    requiredSkills: [{ type: String, trim: true }],
    salaryRange: { type: String, default: "", trim: true },
    applicationDeadline: { type: Date },
    logo: { type: String, default: "", trim: true },
    status: { type: String, enum: ["Active", "Closed"], default: "Active" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now }
  },
  {
    collection: "jobs",
    versionKey: false
  }
);

jobSchema.pre("save", async function assignId(next) {
  if (!this.isNew || this.id) return next();
  this.id = await getNextSequence("jobs");
  return next();
});

module.exports = mongoose.model("Job", jobSchema);
