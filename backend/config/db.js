const mongoose = require("mongoose");
require("dotenv").config();

const seedDefaults = require("./seedData");

const connectDB = async () => {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not configured. Add it to your .env file.");
  }

  await mongoose.connect(MONGO_URI, {
    dbName: "jobjourney"
  });

  await seedDefaults();

  console.log(`[DB] Connected to MongoDB: ${mongoose.connection.name}`);
};

module.exports = connectDB;
