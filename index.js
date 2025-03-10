import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(express.json()); // ✅ Ensure JSON body is parsed
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
  res.json({
    activeStatus: true,
    error: false,
    message: `Backend is running on ${process.env.LOCAL_IP}:${process.env.PORT}`,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
