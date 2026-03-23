const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Role = require("../models/Role");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getUsers = async (_req, res) => {
  try {
    const users = await User.find().populate("role_id", "role_name").sort({ created_at: -1 });
    return res.json(users.map((user) => User.sanitize(user)));
  } catch (error) {
    console.error("[Users] getUsers failed:", error);
    return res.status(500).json({ message: "Failed to fetch users.", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    const user = await User.findOne({ id: userId }).populate("role_id", "role_name");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(User.sanitize(user));
  } catch (error) {
    console.error("[Users] getUserById failed:", error);
    return res.status(500).json({ message: "Failed to fetch user.", error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "User already exists." });
    }

    const roleDoc = await Role.findOne({ role_name: role });
    if (!roleDoc) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const created = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role_id: roleDoc._id
    });

    const user = await User.findById(created._id).populate("role_id", "role_name");
    return res.status(201).json(User.sanitize(user));
  } catch (error) {
    console.error("[Users] createUser failed:", error);
    return res.status(500).json({ message: "Failed to create user.", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    const user = await User.findOne({ id: userId }).populate("role_id", "role_name");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { name, email, password, role, disabled } = req.body;

    if (name !== undefined) user.name = name;

    if (email !== undefined) {
      const normalizedEmail = String(email).toLowerCase().trim();
      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({ message: "Invalid email format." });
      }

      const existing = await User.findOne({ email: normalizedEmail, id: { $ne: userId } });
      if (existing) {
        return res.status(409).json({ message: "Email is already in use." });
      }
      user.email = normalizedEmail;
    }

    if (password !== undefined) {
      if (String(password).length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters." });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    if (role !== undefined) {
      const roleDoc = await Role.findOne({ role_name: role });
      if (!roleDoc) {
        return res.status(400).json({ message: "Invalid role." });
      }
      user.role_id = roleDoc._id;
    }

    if (disabled !== undefined) {
      if (user.role_id?.role_name === "admin" && disabled) {
        return res.status(400).json({ message: "Admin users cannot be disabled." });
      }
      user.disabled = Boolean(disabled);
    }

    await user.save();

    const updated = await User.findById(user._id).populate("role_id", "role_name");
    return res.json(User.sanitize(updated));
  } catch (error) {
    console.error("[Users] updateUser failed:", error);
    return res.status(500).json({ message: "Failed to update user.", error: error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    const user = await User.findOne({ id: userId }).populate("role_id", "role_name");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role_id?.role_name === "admin") {
      return res.status(400).json({ message: "Admin users cannot be disabled." });
    }

    user.disabled = !Boolean(user.disabled);
    await user.save();

    const updated = await User.findById(user._id).populate("role_id", "role_name");
    return res.json(User.sanitize(updated));
  } catch (error) {
    console.error("[Users] toggleUserStatus failed:", error);
    return res.status(500).json({ message: "Failed to update user.", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    const user = await User.findOne({ id: userId }).populate("role_id", "role_name");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role_id?.role_name === "admin") {
      return res.status(400).json({ message: "Admin users cannot be deleted." });
    }

    await User.deleteOne({ _id: user._id });
    return res.json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("[Users] deleteUser failed:", error);
    return res.status(500).json({ message: "Failed to delete user.", error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser
};
