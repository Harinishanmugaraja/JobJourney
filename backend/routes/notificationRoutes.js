const express = require("express");
const {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification
} = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createNotification);
router.get("/", getNotifications);
router.get("/:id", getNotificationById);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);

module.exports = router;
