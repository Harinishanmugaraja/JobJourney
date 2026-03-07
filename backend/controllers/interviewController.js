const Interview = require("../models/Interview");
const Application = require("../models/Application");

const createInterview = async (req, res) => {
  try {
    const { applicationId, interviewDate, interviewTime, meetingLink } = req.body;

    if (!applicationId || !interviewDate || !interviewTime || !meetingLink) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    const interview = await Interview.create({
      applicationId,
      interviewDate,
      interviewTime,
      company: application.companyName,
      meetingLink,
      createdBy: req.user.id
    });

    await Application.updateById(applicationId, { status: "Interview Scheduled" });

    return res.status(201).json(interview);
  } catch (error) {
    return res.status(500).json({ message: "Failed to schedule interview.", error: error.message });
  }
};

const getInterviews = async (req, res) => {
  try {
    let data = await Interview.find();

    if (req.user.role === "jobseeker") {
      const applications = await Application.find({ userId: req.user.id });
      const ids = new Set(applications.map((application) => application.id));
      data = data.filter((interview) => ids.has(interview.applicationId));
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch interviews.", error: error.message });
  }
};

const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    const updated = await Interview.updateById(id, req.body);
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update interview.", error: error.message });
  }
};

module.exports = {
  createInterview,
  getInterviews,
  updateInterview
};
