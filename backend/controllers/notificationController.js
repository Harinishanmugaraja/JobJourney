const Notification = require("../models/Notification");
const User = require("../models/User");
const {
  createNotificationForUser,
  emitNotificationsCleared,
  emitNotificationUpdated,
  toNotificationResponse
} = require("../services/notificationService");

const resolveTargetUser = async (requestedUserId, req) => {
  if (requestedUserId !== undefined) {
    const parsed = Number(requestedUserId);
    if (Number.isNaN(parsed)) return null;
    return User.findOne({ id: parsed });
  }

  return User.findOne({ id: req.user.id });
};

const createNotification = async (req, res) => {
  try {
    const { message, userId, type } = req.body;

    if (!message || !type) {
      return res.status(400).json({ message: "Message and type are required." });
    }

    const targetUser = await resolveTargetUser(userId, req);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (req.user.role !== "admin" && targetUser.id !== req.user.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    const notification = await createNotificationForUser({
      user: targetUser,
      message,
      type
    });

    return res.status(201).json(notification);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create notification.", error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const targetUserId = req.params.userId || req.query.userId;
    const targetUser = await resolveTargetUser(targetUserId, req);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (req.user.role !== "admin" && targetUser.id !== req.user.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    const query = { user_id: targetUser._id };
    if (req.query.filter === "unread") {
      query.is_read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ created_at: -1 })
      .populate("user_id", "id");

    return res.json(notifications.map(toNotificationResponse));
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notifications.", error: error.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid notification id." });
    }

    const notification = await Notification.findOne({ id }).populate("user_id", "id _id");
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    if (req.user.role !== "admin") {
      const user = await User.findOne({ id: req.user.id }).select("_id");
      if (!user || String(notification.user_id?._id) !== String(user._id)) {
        return res.status(403).json({ message: "Access denied." });
      }
    }

    notification.is_read = true;
    await notification.save();

    const updated = await Notification.findById(notification._id).populate("user_id", "id");
    const payload = toNotificationResponse(updated);
    emitNotificationUpdated(payload);
    return res.json(payload);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update notification.", error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid notification id." });
    }

    const notification = await Notification.findOne({ id }).populate("user_id", "id _id");
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    if (req.user.role !== "admin") {
      const user = await User.findOne({ id: req.user.id }).select("_id");
      if (!user || String(notification.user_id?._id) !== String(user._id)) {
        return res.status(403).json({ message: "Access denied." });
      }
    }

    await Notification.deleteOne({ _id: notification._id });
    return res.json({ message: "Notification deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete notification.", error: error.message });
  }
};

const clearNotifications = async (req, res) => {
  try {
    const targetUserId = req.query.userId;
    const targetUser = await resolveTargetUser(targetUserId, req);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (req.user.role !== "admin" && targetUser.id !== req.user.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    await Notification.deleteMany({ user_id: targetUser._id });
    emitNotificationsCleared(targetUser.id);

    return res.json({ message: "Notifications cleared successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to clear notifications.", error: error.message });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  clearNotifications
};
