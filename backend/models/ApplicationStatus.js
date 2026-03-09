const mongoose = require("mongoose");
const getNextSequence = require("../utils/sequence");

const applicationStatusSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    status_name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" }
  },
  {
    collection: "application_status",
    versionKey: false
  }
);

applicationStatusSchema.pre("save", async function assignId(next) {
  if (!this.isNew || this.id) return next();
  this.id = await getNextSequence("application_status");
  return next();
});

module.exports = mongoose.model("ApplicationStatus", applicationStatusSchema);
