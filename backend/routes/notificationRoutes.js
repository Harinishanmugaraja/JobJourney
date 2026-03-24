const express = require("express");
const {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  clearNotifications
} = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createNotification);
router.get("/", getNotifications);
router.delete("/", clearNotifications);
router.get("/:userId", getNotifications);
router.patch("/:id/read", markNotificationAsRead);
router.delete("/:id", deleteNotification);

module.exports = router;
