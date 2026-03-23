const Interview = require("../models/Interview");
const Application = require("../models/Application");
const ApplicationStatus = require("../models/ApplicationStatus");
const InterviewMode = require("../models/InterviewMode");
const User = require("../models/User");

const toInterviewResponse = (doc) => {
  const interview = doc.toObject ? doc.toObject() : doc;
  const app = interview.application_id || {};

  return {
    id: interview.id,
    interviewDate: interview.interview_date,
    interviewTime: interview.interview_time || "",
    meetingLink: interview.meeting_link || interview.location || "",
    location: interview.location,
    mode: interview.mode_id?.mode_name || null,
    applicationId: app.id || null,
    company: app.company_name || "",
    companyName: app.company_name || "",
    jobRole: app.job_role || ""
  };
};

const createInterview = async (req, res) => {
  try {
    const { applicationId, interviewDate, interviewTime, meetingLink, location, modeName } = req.body;

    if (!applicationId || !interviewDate) {
      return res.status(400).json({ message: "Application and interview date are required." });
    }

    const appId = Number(applicationId);
    if (Number.isNaN(appId)) {
      return res.status(400).json({ message: "Invalid application id." });
    }

    const application = await Application.findOne({ id: appId });
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    const interviewDateObj = new Date(interviewDate);
    if (Number.isNaN(interviewDateObj.getTime())) {
      return res.status(400).json({ message: "Invalid interview date." });
    }

    const normalizedMode = (modeName || "Online").trim();
    const mode = await InterviewMode.findOne({ mode_name: normalizedMode });
    if (!mode) {
      return res.status(400).json({ message: "Invalid interview mode." });
    }

    const currentUser = await User.findOne({ id: req.user.id }).select("_id");

    const created = await Interview.create({
      interview_date: interviewDateObj,
      mode_id: mode._id,
      location: location || meetingLink || "",
      application_id: application._id,
      interview_time: interviewTime || "",
      meeting_link: meetingLink || "",
      created_by: currentUser?._id
    });

    const statusDoc = await ApplicationStatus.findOne({ status_name: "Interview Scheduled" }).select("_id");
    if (statusDoc) {
      await Application.updateOne({ _id: application._id }, { status_id: statusDoc._id });
    }

    const interview = await Interview.findById(created._id)
      .populate("mode_id", "mode_name")
      .populate("application_id", "id company_name job_role");

    return res.status(201).json(toInterviewResponse(interview));
  } catch (error) {
    console.error("[Interviews] createInterview failed:", error);
    return res.status(500).json({ message: "Failed to schedule interview.", error: error.message });
  }
};

const getInterviews = async (req, res) => {
  try {
    const query = {};

    if (req.user.role === "jobseeker") {
      const currentUser = await User.findOne({ id: req.user.id }).select("_id");
      if (!currentUser) {
        return res.status(401).json({ message: "Invalid user session." });
      }

      const applications = await Application.find({ user_id: currentUser._id }).select("_id");
      query.application_id = { $in: applications.map((item) => item._id) };
    }

    const interviews = await Interview.find(query)
      .sort({ interview_date: 1 })
      .populate("mode_id", "mode_name")
      .populate("application_id", "id company_name job_role");

    return res.json(interviews.map(toInterviewResponse));
  } catch (error) {
    console.error("[Interviews] getInterviews failed:", error);
    return res.status(500).json({ message: "Failed to fetch interviews.", error: error.message });
  }
};

const getInterviewById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid interview id." });
    }

    const interview = await Interview.findOne({ id })
      .populate("mode_id", "mode_name")
      .populate("application_id", "id company_name job_role user_id");

    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    return res.json(toInterviewResponse(interview));
  } catch (error) {
    console.error("[Interviews] getInterviewById failed:", error);
    return res.status(500).json({ message: "Failed to fetch interview.", error: error.message });
  }
};

const updateInterview = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid interview id." });
    }

    const interview = await Interview.findOne({ id });
    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    const updates = {};

    if (req.body.interviewDate !== undefined) {
      const interviewDateObj = new Date(req.body.interviewDate);
      if (Number.isNaN(interviewDateObj.getTime())) {
        return res.status(400).json({ message: "Invalid interview date." });
      }
      updates.interview_date = interviewDateObj;
    }

    if (req.body.interviewTime !== undefined) updates.interview_time = req.body.interviewTime;
    if (req.body.meetingLink !== undefined) updates.meeting_link = req.body.meetingLink;
    if (req.body.location !== undefined) updates.location = req.body.location;

    if (req.body.modeName !== undefined) {
      const mode = await InterviewMode.findOne({ mode_name: req.body.modeName });
      if (!mode) {
        return res.status(400).json({ message: "Invalid interview mode." });
      }
      updates.mode_id = mode._id;
    }

    await Interview.updateOne({ _id: interview._id }, updates);

    const updated = await Interview.findById(interview._id)
      .populate("mode_id", "mode_name")
      .populate("application_id", "id company_name job_role");

    return res.json(toInterviewResponse(updated));
  } catch (error) {
    console.error("[Interviews] updateInterview failed:", error);
    return res.status(500).json({ message: "Failed to update interview.", error: error.message });
  }
};

const deleteInterview = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid interview id." });
    }

    const interview = await Interview.findOne({ id });
    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    await Interview.deleteOne({ _id: interview._id });
    return res.json({ message: "Interview deleted successfully." });
  } catch (error) {
    console.error("[Interviews] deleteInterview failed:", error);
    return res.status(500).json({ message: "Failed to delete interview.", error: error.message });
  }
};

module.exports = {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview
};
