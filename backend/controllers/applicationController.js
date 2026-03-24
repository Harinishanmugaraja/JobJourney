const Application = require("../models/Application");
const ApplicationStatus = require("../models/ApplicationStatus");
const Role = require("../models/Role");
const User = require("../models/User");
const Job = require("../models/Job");
const { createNotificationForUser } = require("../services/notificationService");

const validStatuses = ["Applied", "Under Review", "Interview Scheduled", "Selected", "Rejected"];
const validResumeExtensions = [".pdf", ".doc", ".docx"];

const hasValidResume = (resume) => {
  const lower = String(resume).toLowerCase();
  return validResumeExtensions.some((ext) => lower.endsWith(ext));
};

const toApplicationResponse = (doc) => {
  const item = doc.toObject ? doc.toObject() : doc;

  return {
    id: item.id,
    companyName: item.company_name,
    jobRole: item.job_role,
    status: item.status_id?.status_name || null,
    resume: item.resume_url,
    resumeUrl: item.resume_url,
    applicantName: item.applicant_name || null,
    applicantEmail: item.applicant_email || null,
    coverLetter: item.cover_letter || null,
    jobId: item.job_id?.id || null,
    applicationDate: item.applied_date,
    userId: item.user_id?.id || null,
    userRole: item.user_id?.role_id?.role_name || null
  };
};

const createApplication = async (req, res) => {
  try {
    const {
      companyName,
      jobRole,
      resume,
      resumeUrl,
      applicationDate,
      applicantName,
      applicantEmail,
      coverLetter,
      jobId
    } = req.body;

    let resolvedCompanyName = companyName;
    let resolvedJobRole = jobRole;
    let resolvedJobRef;
    const resolvedResume = resumeUrl || resume;

    if (!resolvedResume || !applicationDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (jobId !== undefined && jobId !== null) {
      const numericJobId = Number(jobId);
      if (Number.isNaN(numericJobId)) {
        return res.status(400).json({ message: "Invalid job id." });
      }

      const targetJob = await Job.findOne({ id: numericJobId });
      if (!targetJob) {
        return res.status(404).json({ message: "Job not found." });
      }
      resolvedCompanyName = targetJob.companyName;
      resolvedJobRole = targetJob.title;
      resolvedJobRef = targetJob._id;
    }

    if (!resolvedCompanyName || !resolvedJobRole) {
      return res.status(400).json({ message: "Company name and job role are required." });
    }

    if (!hasValidResume(resolvedResume)) {
      return res.status(400).json({ message: "Resume must be PDF/DOC/DOCX." });
    }

    const applied = new Date(applicationDate);
    if (Number.isNaN(applied.getTime())) {
      return res.status(400).json({ message: "Invalid application date." });
    }

    const user = await User.findOne({ id: req.user.id });
    if (!user) {
      return res.status(401).json({ message: "Invalid user session." });
    }

    const defaultStatus = await ApplicationStatus.findOne({ status_name: "Applied" });
    if (!defaultStatus) {
      return res.status(500).json({ message: "Default status configuration missing." });
    }

    const created = await Application.create({
      company_name: resolvedCompanyName,
      job_role: resolvedJobRole,
      status_id: defaultStatus._id,
      resume_url: resolvedResume,
      applicant_name: applicantName || user.name,
      applicant_email: applicantEmail || user.email,
      cover_letter: coverLetter || "",
      job_id: resolvedJobRef,
      applied_date: applied,
      user_id: user._id
    });

    const application = await Application.findById(created._id)
      .populate("status_id", "status_name")
      .populate("job_id", "id title companyName")
      .populate({ path: "user_id", select: "id", populate: { path: "role_id", select: "role_name" } });

    return res.status(201).json(toApplicationResponse(application));
  } catch (error) {
    console.error("[Applications] createApplication failed:", error);
    return res.status(500).json({ message: "Failed to create application.", error: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const { status, company, date, role } = req.query;
    const query = {};

    if (req.user.role === "jobseeker") {
      const currentUser = await User.findOne({ id: req.user.id }).select("_id");
      if (!currentUser) {
        return res.status(401).json({ message: "Invalid user session." });
      }
      query.user_id = currentUser._id;
    }

    if (company) {
      query.company_name = { $regex: company, $options: "i" };
    }

    if (date) {
      const start = new Date(date);
      if (Number.isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid date filter." });
      }
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      query.applied_date = { $gte: start, $lt: end };
    }

    if (status) {
      const statusDoc = await ApplicationStatus.findOne({ status_name: status });
      if (!statusDoc) {
        return res.json([]);
      }
      query.status_id = statusDoc._id;
    }

    if (req.user.role === "employer" && !status) {
      const selected = await ApplicationStatus.findOne({ status_name: "Selected" }).select("_id");
      if (selected) {
        query.status_id = { $ne: selected._id };
      }
    }

    if (role) {
      const roleDoc = await Role.findOne({ role_name: role.toLowerCase() }).select("_id");
      if (!roleDoc) {
        return res.json([]);
      }

      const users = await User.find({ role_id: roleDoc._id }).select("_id");
      query.user_id = { $in: users.map((item) => item._id) };
    }

    const applications = await Application.find(query)
      .sort({ applied_date: -1 })
      .populate("status_id", "status_name")
      .populate("job_id", "id title companyName")
      .populate({ path: "user_id", select: "id", populate: { path: "role_id", select: "role_name" } });

    return res.json(applications.map(toApplicationResponse));
  } catch (error) {
    console.error("[Applications] getApplications failed:", error);
    return res.status(500).json({ message: "Failed to fetch applications.", error: error.message });
  }
};

const updateApplication = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid application id." });
    }

    const application = await Application.findOne({ id }).populate("user_id", "id name email");

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (req.user.role === "jobseeker" && application.user_id?.id !== req.user.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    const payload = {};
    const previousStatus = application.status_id;

    if (req.body.companyName !== undefined) payload.company_name = req.body.companyName;
    if (req.body.jobRole !== undefined) payload.job_role = req.body.jobRole;

    if (req.body.resume !== undefined || req.body.resumeUrl !== undefined) {
      const resolvedResume = req.body.resumeUrl || req.body.resume;
      if (!hasValidResume(resolvedResume)) {
        return res.status(400).json({ message: "Resume must be PDF/DOC/DOCX." });
      }
      payload.resume_url = resolvedResume;
    }

    if (req.body.applicationDate !== undefined) {
      const applied = new Date(req.body.applicationDate);
      if (Number.isNaN(applied.getTime())) {
        return res.status(400).json({ message: "Invalid application date." });
      }
      payload.applied_date = applied;
    }

    if (req.body.status !== undefined) {
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({ message: "Invalid status." });
      }
      const statusDoc = await ApplicationStatus.findOne({ status_name: req.body.status });
      if (!statusDoc) {
        return res.status(500).json({ message: "Status configuration missing." });
      }
      payload.status_id = statusDoc._id;
    }

    await Application.updateOne({ _id: application._id }, payload);

    const updated = await Application.findById(application._id)
      .populate("status_id", "status_name")
      .populate("job_id", "id title companyName")
      .populate({ path: "user_id", select: "id", populate: { path: "role_id", select: "role_name" } });

    if (
      req.body.status !== undefined &&
      req.user.role !== "jobseeker" &&
      String(previousStatus) !== String(updated.status_id?._id)
    ) {
      const targetUser = await User.findOne({ id: application.user_id?.id }).select("_id id name email");
      if (targetUser) {
        await createNotificationForUser({
          user: targetUser,
          type: "status_update",
          message: `Your application for ${updated.jobRole || updated.job_id?.title || application.job_role} at ${
            updated.companyName || updated.job_id?.companyName || application.company_name
          } is now ${updated.status}.`
        });
      }
    }

    return res.json(toApplicationResponse(updated));
  } catch (error) {
    console.error("[Applications] updateApplication failed:", error);
    return res.status(500).json({ message: "Failed to update application.", error: error.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid application id." });
    }

    const application = await Application.findOne({ id }).populate("user_id", "id");

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (req.user.role === "jobseeker" && application.user_id?.id !== req.user.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    await Application.deleteOne({ _id: application._id });
    return res.json({ message: "Application removed successfully." });
  } catch (error) {
    console.error("[Applications] deleteApplication failed:", error);
    return res.status(500).json({ message: "Failed to delete application.", error: error.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication
};
