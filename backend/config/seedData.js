const Role = require("../models/Role");
const ApplicationStatus = require("../models/ApplicationStatus");
const InterviewMode = require("../models/InterviewMode");
const getNextSequence = require("../utils/sequence");

const repairNullIds = async (Model, counterKey) => {
  const brokenDocs = await Model.find({
    $or: [{ id: null }, { id: { $exists: false } }]
  });

  for (const doc of brokenDocs) {
    doc.id = await getNextSequence(counterKey);
    await doc.save();
  }
};

const ensureExists = async (Model, query, payload) => {
  const existing = await Model.findOne(query);
  if (!existing) {
    await Model.create(payload);
  }
};

const seedDefaults = async () => {
  const roles = ["jobseeker", "employer", "admin"];
  const statuses = [
    { status_name: "Applied", description: "Application submitted" },
    { status_name: "Under Review", description: "Profile screening in progress" },
    { status_name: "Interview Scheduled", description: "Interview arranged" },
    { status_name: "Selected", description: "Candidate selected" },
    { status_name: "Rejected", description: "Application rejected" }
  ];
  const modes = ["Online", "Offline", "Phone"];

  // Repair legacy null ids created by findOneAndUpdate upserts.
  await repairNullIds(Role, "roles");
  await repairNullIds(ApplicationStatus, "application_status");
  await repairNullIds(InterviewMode, "interview_modes");

  for (const role_name of roles) {
    await ensureExists(Role, { role_name }, { role_name });
  }

  for (const status of statuses) {
    await ensureExists(ApplicationStatus, { status_name: status.status_name }, status);
  }

  for (const mode_name of modes) {
    await ensureExists(InterviewMode, { mode_name }, { mode_name });
  }
};

module.exports = seedDefaults;
