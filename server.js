const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());            // Enable CORS for all routes
app.use(express.json());    // Parse JSON bodies
app.use(morgan("dev"));     // Logger

// API routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/blog", require("./routes/blogRoutes"));

// Serve React static files
app.use(express.static(path.join(__dirname, "client", "build")));

// Catch-all to serve React app for any other route (SPA routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode port no ${PORT}`.bgCyan.white
  );
});
