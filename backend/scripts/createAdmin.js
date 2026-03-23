require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Role = require("../models/Role");

const DEFAULT_ADMIN_EMAIL = "admin@jobtracker.com";
const DEFAULT_ADMIN_PASSWORD = "Admin@123";
const DEFAULT_ADMIN_NAME = "System Admin";

const createAdmin = async () => {
  try {
    await connectDB();

    const adminRole = await Role.findOne({ role_name: "admin" });
    if (!adminRole) {
      throw new Error("Admin role not found. Ensure role seeding is configured.");
    }

    const adminEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || DEFAULT_ADMIN_NAME;

    const existingAdmin = await User.findOne({ email: adminEmail }).populate("role_id", "role_name");
    if (existingAdmin) {
      const existingRole = existingAdmin.role_id?.role_name;
      if (existingRole !== "admin") {
        throw new Error(`User ${adminEmail} already exists with role "${existingRole}".`);
      }
      console.log(`[ADMIN] Admin account already exists for ${adminEmail}.`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role_id: adminRole._id
    });

    console.log(`[ADMIN] Admin account created for ${adminEmail}.`);
    process.exit(0);
  } catch (error) {
    console.error("[ADMIN] Failed to create admin account:", error.message);
    process.exit(1);
  }
};

createAdmin();
