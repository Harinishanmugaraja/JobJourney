const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid authorization token." });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super-secret-dev-key");

    const user = await User.findOne({ id: decoded.id }).populate("role_id", "role_name");
    if (!user || user.disabled) {
      return res.status(401).json({ message: "Invalid or disabled user account." });
    }

    req.user = {
      id: user.id,
      _id: user._id,
      email: user.email,
      role: user.role_id?.role_name
    };

    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
