const express = require("express");
const {
  createInterview,
  getInterviews,
  updateInterview
} = require("../controllers/interviewController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.post("/", roleMiddleware("employer", "admin"), createInterview);
router.get("/", getInterviews);
router.put("/:id", roleMiddleware("employer", "admin"), updateInterview);

module.exports = router;
