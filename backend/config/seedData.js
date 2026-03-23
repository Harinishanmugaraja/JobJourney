const Role = require("../models/Role");
const ApplicationStatus = require("../models/ApplicationStatus");
const InterviewMode = require("../models/InterviewMode");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
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

const ensureDefaultAdmin = async () => {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@jobtracker.com").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const adminName = process.env.ADMIN_NAME || "System Admin";

  const adminRole = await Role.findOne({ role_name: "admin" });
  if (!adminRole) return;

  const existingAdmin = await User.findOne({ email: adminEmail });
  const hash = await bcrypt.hash(adminPassword, 10);

  if (existingAdmin) {
    existingAdmin.name = adminName;
    existingAdmin.password = hash;
    existingAdmin.role_id = adminRole._id;
    existingAdmin.disabled = false;
    await existingAdmin.save();
    return;
  }

  await User.create({
    name: adminName,
    email: adminEmail,
    password: hash,
    role_id: adminRole._id,
    disabled: false
  });
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

  await ensureDefaultAdmin();
};

module.exports = seedDefaults;
