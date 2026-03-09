const express = require("express");
const {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview
} = require("../controllers/interviewController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", roleMiddleware("employer", "admin"), createInterview);
router.get("/", getInterviews);
router.get("/:id", getInterviewById);
router.put("/:id", roleMiddleware("employer", "admin"), updateInterview);
router.delete("/:id", roleMiddleware("employer", "admin"), deleteInterview);

module.exports = router;
