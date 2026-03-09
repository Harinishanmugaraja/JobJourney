const mongoose = require("mongoose");
const getNextSequence = require("../utils/sequence");

const roleSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    role_name: { type: String, required: true, unique: true, trim: true, lowercase: true }
  },
  {
    collection: "roles",
    versionKey: false
  }
);

roleSchema.pre("save", async function assignId(next) {
  if (!this.isNew || this.id) return next();
  this.id = await getNextSequence("roles");
  return next();
});

module.exports = mongoose.model("Role", roleSchema);
