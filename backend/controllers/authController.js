const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");

const validRoles = ["jobseeker", "employer", "admin"];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "User already exists." });
    }

    const roleDoc = await Role.findOne({ role_name: role });
    if (!roleDoc) {
      return res.status(500).json({ message: "Role configuration missing." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const created = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role_id: roleDoc._id
    });

    const user = await User.findById(created._id).populate("role_id", "role_name");

    return res.status(201).json({
      message: "Registration successful.",
      user: User.sanitize(user)
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed.", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).populate("role_id", "role_name");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (user.disabled) {
      return res.status(403).json({ message: "Your account is disabled. Contact administrator." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const role = user.role_id?.role_name;

    const token = jwt.sign(
      { id: user.id, role, email: user.email },
      process.env.JWT_SECRET || "super-secret-dev-key",
      { expiresIn: "12h" }
    );

    return res.json({
      message: "Login successful.",
      token,
      user: User.sanitize(user)
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed.", error: error.message });
  }
};

module.exports = {
  register,
  login
};
