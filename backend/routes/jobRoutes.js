const express = require("express");
const {
  createJob,
  getJobs,
  updateJob,
  deleteJob
} = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/", getJobs);
router.post("/", roleMiddleware("employer", "admin"), createJob);
router.put("/:id", roleMiddleware("employer", "admin"), updateJob);
router.delete("/:id", roleMiddleware("employer", "admin"), deleteJob);

module.exports = router;
