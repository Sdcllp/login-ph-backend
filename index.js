import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import os from "os";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

// Updated CORS Configuration for Vercel
const allowedOrigins = [
  "https://login-ph-frontend.vercel.app",
  "http://localhost:3000",
  "https://siteservice-quote-back.vercel.app"  // Add your Vercel domain
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Define PORT for Vercel or local environment
const PORT = process.env.PORT || 5000;

// MongoDB connection setup
mongoose
  .connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Routes
app.use("/api/auth", authRoutes);

// Default Route
app.get("/", (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend API is running',
    environment: process.env.NODE_ENV
  });
});

// Export the app for Vercel
export default app;

// Start server only in development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}
