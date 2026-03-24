const express = require("express");
const http = require("http");
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const User = require("./models/User");
const { setSocketServer, getUserRoom } = require("./socket");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
  }
});

app.use(cors());
app.use(express.json());
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", mode: "mongodb" });
});

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Missing authentication token."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super-secret-dev-key");
    const user = await User.findOne({ id: decoded.id }).populate("role_id", "role_name");

    if (!user || user.disabled) {
      return next(new Error("Invalid user session."));
    }

    socket.user = {
      id: user.id,
      role: user.role_id?.role_name
    };

    return next();
  } catch (error) {
    return next(new Error("Socket authentication failed."));
  }
});

io.on("connection", (socket) => {
  if (socket.user?.id) {
    socket.join(getUserRoom(socket.user.id));
  }
});

setSocketServer(io);

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
