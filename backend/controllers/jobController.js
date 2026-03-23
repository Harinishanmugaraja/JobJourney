const Job = require("../models/Job");
const User = require("../models/User");

const validStatuses = ["Active", "Closed"];
const validJobTypes = ["Full Time", "Internship", "Remote"];

const toJobResponse = (doc) => {
  const job = doc.toObject ? doc.toObject() : doc;
  return {
    id: job.id,
    title: job.title,
    companyName: job.companyName,
    location: job.location,
    jobType: job.jobType || null,
    shortDescription: job.shortDescription || "",
    description: job.description || "",
    requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills : [],
    salaryRange: job.salaryRange || "",
    applicationDeadline: job.applicationDeadline || null,
    logo: job.logo || "",
    status: job.status,
    createdAt: job.createdAt
  };
};

const createJob = async (req, res) => {
  try {
    const {
      title,
      companyName,
      location,
      jobType,
      shortDescription,
      description,
      requiredSkills,
      salaryRange,
      applicationDeadline,
      logo
    } = req.body;

    if (!title || !companyName || !location) {
      return res.status(400).json({ message: "Title, company name and location are required." });
    }

    if (jobType && !validJobTypes.includes(jobType)) {
      return res.status(400).json({ message: "Invalid job type." });
    }

    const currentUser = await User.findOne({ id: req.user.id }).select("_id");
    if (!currentUser) {
      return res.status(401).json({ message: "Invalid user session." });
    }

    const job = await Job.create({
      title,
      companyName,
      location,
      jobType: jobType || "Full Time",
      shortDescription: shortDescription || "",
      description: description || "",
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      salaryRange: salaryRange || "",
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
      logo: logo || "",
      status: "Active",
      postedBy: currentUser._id
    });

    return res.status(201).json(toJobResponse(job));
  } catch (error) {
    console.error("[Jobs] createJob failed:", error);
    return res.status(500).json({ message: "Failed to create job.", error: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const query = {};
    const { status } = req.query;

    if (req.user.role === "employer") {
      const currentUser = await User.findOne({ id: req.user.id }).select("_id");
      if (!currentUser) {
        return res.status(401).json({ message: "Invalid user session." });
      }
      query.postedBy = currentUser._id;
    }

    if (status) {
      query.status = status;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    return res.json(jobs.map(toJobResponse));
  } catch (error) {
    console.error("[Jobs] getJobs failed:", error);
    return res.status(500).json({ message: "Failed to fetch jobs.", error: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid job id." });
    }

    const job = await Job.findOne({ id });
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    if (req.user.role === "employer") {
      const currentUser = await User.findOne({ id: req.user.id }).select("_id");
      if (!currentUser || String(job.postedBy) !== String(currentUser._id)) {
        return res.status(403).json({ message: "Access denied." });
      }
    }

    return res.json(toJobResponse(job));
  } catch (error) {
    console.error("[Jobs] getJobById failed:", error);
    return res.status(500).json({ message: "Failed to fetch job.", error: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid job id." });
    }

    const target = await Job.findOne({ id });
    if (!target) {
      return res.status(404).json({ message: "Job not found." });
    }

    if (req.user.role === "employer") {
      const currentUser = await User.findOne({ id: req.user.id }).select("_id");
      if (!currentUser || String(target.postedBy) !== String(currentUser._id)) {
        return res.status(403).json({ message: "Access denied." });
      }
    }

    if (req.body.status && !validStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    if (req.body.jobType && !validJobTypes.includes(req.body.jobType)) {
      return res.status(400).json({ message: "Invalid job type." });
    }

    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.companyName !== undefined) updates.companyName = req.body.companyName;
    if (req.body.location !== undefined) updates.location = req.body.location;
    if (req.body.jobType !== undefined) updates.jobType = req.body.jobType;
    if (req.body.shortDescription !== undefined) updates.shortDescription = req.body.shortDescription;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.requiredSkills !== undefined) {
      updates.requiredSkills = Array.isArray(req.body.requiredSkills) ? req.body.requiredSkills : [];
    }
    if (req.body.salaryRange !== undefined) updates.salaryRange = req.body.salaryRange;
    if (req.body.applicationDeadline !== undefined) {
      updates.applicationDeadline = req.body.applicationDeadline ? new Date(req.body.applicationDeadline) : null;
    }
    if (req.body.logo !== undefined) updates.logo = req.body.logo;
    if (req.body.status !== undefined) updates.status = req.body.status;

    await Job.updateOne({ _id: target._id }, updates);

    const updated = await Job.findById(target._id);
    return res.json(toJobResponse(updated));
  } catch (error) {
    console.error("[Jobs] updateJob failed:", error);
    return res.status(500).json({ message: "Failed to update job.", error: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid job id." });
    }

    const target = await Job.findOne({ id });
    if (!target) {
      return res.status(404).json({ message: "Job not found." });
    }

    if (req.user.role === "employer") {
      const currentUser = await User.findOne({ id: req.user.id }).select("_id");
      if (!currentUser || String(target.postedBy) !== String(currentUser._id)) {
        return res.status(403).json({ message: "Access denied." });
      }
    }

    await Job.deleteOne({ _id: target._id });
    return res.json({ message: "Job removed successfully." });
  } catch (error) {
    console.error("[Jobs] deleteJob failed:", error);
    return res.status(500).json({ message: "Failed to delete job.", error: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
};
