const express = require("express");
const homeRoutes = require("./routes/homeRoutes");
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const geoRoutes = require("./routes/geoRoutes");
const adminRoutes = require("./routes/adminRoutes");
const apiKeyAuth = require("./middleware/apiKeyAuth");
const rateLimit = require("./middleware/rateLimit");
const apiUsageLogger = require("./middleware/apiUsageLogger");

const app = express();

app.use(express.json());

app.use("/", homeRoutes);
app.use("/api/v1", healthRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", adminRoutes);
app.use("/api/v1", apiKeyAuth, rateLimit, apiUsageLogger, geoRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

module.exports = app;
