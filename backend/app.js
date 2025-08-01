require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const formRoutes = require("./routes/forms");
const feedbackRoutes = require("./routes/feedback");

const app = express();


app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use((req, res) => {
  console.warn(`Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Route not found" });
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/feedbacksystem")
  .then(() => {
    console.log("MongoDB connected successfully");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("MongoDB connection failed:", err));