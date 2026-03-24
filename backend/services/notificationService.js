const Notification = require("../models/Notification");
const Role = require("../models/Role");
const User = require("../models/User");
const { emitToUser } = require("../socket");

const toNotificationResponse = (doc) => {
  const notification = doc.toObject ? doc.toObject() : doc;

  return {
    id: notification.id,
    userId: notification.user_id?.id || notification.userId || null,
    message: notification.message,
    type: notification.type,
    isRead: Boolean(notification.is_read),
    createdAt: notification.created_at
  };
};

const hydrateNotification = async (notificationId) =>
  Notification.findById(notificationId).populate("user_id", "id");

const createNotificationForUser = async ({ user, message, type }) => {
  const created = await Notification.create({
    message,
    type,
    user_id: user._id
  });

  const populated = await hydrateNotification(created._id);
  const payload = toNotificationResponse(populated);
  emitToUser(payload.userId, "notification:new", payload);
  return payload;
};

const createNotificationsForUsers = async ({ users, message, type }) => {
  const createdNotifications = [];

  for (const user of users) {
    const nextMessage = typeof message === "function" ? message(user) : message;
    if (!nextMessage) continue;

    const payload = await createNotificationForUser({
      user,
      message: nextMessage,
      type
    });

    createdNotifications.push(payload);
  }

  return createdNotifications;
};

const getJobSeekers = async () => {
  const jobSeekerRole = await Role.findOne({ role_name: "jobseeker" }).select("_id");
  if (!jobSeekerRole) return [];

  return User.find({ role_id: jobSeekerRole._id }).select("_id id name email");
};

const emitNotificationUpdated = (notification) => {
  emitToUser(notification.userId, "notification:updated", notification);
};

const emitNotificationsCleared = (userId) => {
  emitToUser(userId, "notification:cleared", { userId });
};

module.exports = {
  createNotificationForUser,
  createNotificationsForUsers,
  emitNotificationUpdated,
  emitNotificationsCleared,
  getJobSeekers,
  toNotificationResponse
};
