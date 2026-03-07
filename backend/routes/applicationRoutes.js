const express = require("express");
const {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication
} = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.post("/", createApplication);
router.get("/", getApplications);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

module.exports = router;
