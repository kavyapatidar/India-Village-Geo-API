const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy"
  });
});

router.get("/health/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: "Database connection is healthy"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message
    });
  }
});

module.exports = router;
