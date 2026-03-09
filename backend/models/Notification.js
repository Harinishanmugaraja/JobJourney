const mongoose = require("mongoose");
const getNextSequence = require("../utils/sequence");

const notificationSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    message: { type: String, required: true, trim: true },
    is_read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  {
    collection: "notifications",
    versionKey: false
  }
);

notificationSchema.pre("save", async function assignId(next) {
  if (!this.isNew || this.id) return next();
  this.id = await getNextSequence("notifications");
  return next();
});

module.exports = mongoose.model("Notification", notificationSchema);
