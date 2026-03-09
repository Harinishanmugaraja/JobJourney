const Job = require("../models/Job");
const User = require("../models/User");

const validStatuses = ["Active", "Closed"];

const createJob = async (req, res) => {
  try {
    const { title, companyName, location } = req.body;

    if (!title || !companyName || !location) {
      return res.status(400).json({ message: "Title, company name and location are required." });
    }

    const currentUser = await User.findOne({ id: req.user.id }).select("_id");
    if (!currentUser) {
      return res.status(401).json({ message: "Invalid user session." });
    }

    const job = await Job.create({
      title,
      companyName,
      location,
      status: "Active",
      postedBy: currentUser._id
    });

    return res.status(201).json(job);
  } catch (error) {
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
    return res.json(jobs);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch jobs.", error: error.message });
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

    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.companyName !== undefined) updates.companyName = req.body.companyName;
    if (req.body.location !== undefined) updates.location = req.body.location;
    if (req.body.status !== undefined) updates.status = req.body.status;

    await Job.updateOne({ _id: target._id }, updates);

    const updated = await Job.findById(target._id);
    return res.json(updated);
  } catch (error) {
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
    return res.status(500).json({ message: "Failed to delete job.", error: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob
};
