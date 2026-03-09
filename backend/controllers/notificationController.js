const Notification = require("../models/Notification");
const User = require("../models/User");

const toNotificationResponse = (doc) => {
  const notification = doc.toObject ? doc.toObject() : doc;

  return {
    id: notification.id,
    message: notification.message,
    isRead: Boolean(notification.is_read),
    createdAt: notification.created_at,
    userId: notification.user_id?.id || null
  };
};

const createNotification = async (req, res) => {
  try {
    const { message, userId, isRead } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    let targetUser;

    if (req.user.role === "admin" && userId !== undefined) {
      const parsed = Number(userId);
      if (Number.isNaN(parsed)) {
        return res.status(400).json({ message: "Invalid user id." });
      }
      targetUser = await User.findOne({ id: parsed });
    } else {
      targetUser = await User.findOne({ id: req.user.id });
    }

    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const created = await Notification.create({
      message,
      is_read: Boolean(isRead),
      user_id: targetUser._id
    });

    const notification = await Notification.findById(created._id).populate("user_id", "id");
    return res.status(201).json(toNotificationResponse(notification));
  } catch (error) {
    return res.status(500).json({ message: "Failed to create notification.", error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const query = {};

    if (req.user.role !== "admin") {
      const currentUser = await User.findOne({ id: req.user.id }).select("_id");
      if (!currentUser) {
        return res.status(401).json({ message: "Invalid user session." });
      }
      query.user_id = currentUser._id;
    }

    const notifications = await Notification.find(query)
      .sort({ created_at: -1 })
      .populate("user_id", "id");

    return res.json(notifications.map(toNotificationResponse));
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notifications.", error: error.message });
  }
};

const getNotificationById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid notification id." });
    }

    const notification = await Notification.findOne({ id }).populate("user_id", "id");
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    if (req.user.role !== "admin") {
      const user = await User.findOne({ id: req.user.id }).select("id _id");
      if (!user || String(notification.user_id?._id) !== String(user._id)) {
        return res.status(403).json({ message: "Access denied." });
      }
    }

    return res.json(toNotificationResponse(notification));
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notification.", error: error.message });
  }
};

const updateNotification = async (req, res) => {
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

    if (req.body.message !== undefined) notification.message = req.body.message;
    if (req.body.isRead !== undefined) notification.is_read = Boolean(req.body.isRead);

    await notification.save();

    const updated = await Notification.findById(notification._id).populate("user_id", "id");
    return res.json(toNotificationResponse(updated));
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

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification
};
