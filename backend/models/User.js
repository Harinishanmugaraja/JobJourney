const mongoose = require("mongoose");
const getNextSequence = require("../utils/sequence");

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    disabled: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
  },
  {
    collection: "users",
    versionKey: false
  }
);

userSchema.pre("save", async function assignId(next) {
  if (!this.isNew || this.id) return next();
  this.id = await getNextSequence("users");
  return next();
});

userSchema.statics.sanitize = (userDoc) => {
  if (!userDoc) return null;

  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  const role = user.role_id?.role_name || user.role || null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role,
    disabled: Boolean(user.disabled),
    createdAt: user.created_at
  };
};

module.exports = mongoose.model("User", userSchema);
