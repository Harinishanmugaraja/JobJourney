const Application = require("../models/Application");
const User = require("../models/User");

const validStatuses = ["Applied", "Under Review", "Interview Scheduled", "Selected", "Rejected"];
const validResumeExtensions = [".pdf", ".doc", ".docx"];

const hasValidResume = (resume) => {
  const lower = resume.toLowerCase();
  return validResumeExtensions.some((ext) => lower.endsWith(ext));
};

const createApplication = async (req, res) => {
  try {
    const { companyName, jobRole, resume, applicationDate } = req.body;

    if (!companyName || !jobRole || !resume || !applicationDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!hasValidResume(resume)) {
      return res.status(400).json({ message: "Resume must be PDF/DOC/DOCX." });
    }

    const application = await Application.create({
      userId: req.user.id,
      companyName,
      jobRole,
      resume,
      status: "Applied",
      applicationDate
    });

    return res.status(201).json(application);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create application.", error: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const { status, company, date, role } = req.query;
    let data = await Application.find();

    if (req.user.role === "jobseeker") {
      data = data.filter((application) => application.userId === req.user.id);
    }

    if (req.user.role === "employer") {
      data = data.filter((application) => application.status !== "Selected");
    }

    if (status) {
      data = data.filter((application) => application.status === status);
    }

    if (company) {
      data = data.filter((application) =>
        application.companyName.toLowerCase().includes(company.toLowerCase())
      );
    }

    if (date) {
      data = data.filter((application) => application.applicationDate.slice(0, 10) === date);
    }

    if (role) {
      const users = await User.find({ role });
      const ids = new Set(users.map((user) => user.id));
      data = data.filter((application) => ids.has(application.userId));
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch applications.", error: error.message });
  }
};

const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const target = await Application.findById(id);
    if (!target) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (req.user.role === "jobseeker" && target.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    if (req.body.status && !validStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    if (req.body.resume && !hasValidResume(req.body.resume)) {
      return res.status(400).json({ message: "Resume must be PDF/DOC/DOCX." });
    }

    const updated = await Application.updateById(id, req.body);
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update application.", error: error.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const target = await Application.findById(id);
    if (!target) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (req.user.role === "jobseeker" && target.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    await Application.deleteById(id);
    return res.json({ message: "Application removed successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete application.", error: error.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication
};
