import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import os from "os";  // ✅ Import os module

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000; // ✅ Define PORT

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ Function to Get Local Network IP
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

// ✅ CORS Configuration - Allow Specific Origins
const allowedOrigins = [
  "https://login-ph-frontend.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use("/api/auth", authRoutes);

// ✅ Default Route to Show Server Status
app.get("/", (req, res) => {
  const localIp = getLocalIP();
  res.json({
    activeStatus: true,
    error: false,
    message: `Backend is running on ${localIp}:${PORT}`,
  });
});

// ✅ Start the Server on Any Network
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend is Running on ${getLocalIP()}:${PORT}`);
});
