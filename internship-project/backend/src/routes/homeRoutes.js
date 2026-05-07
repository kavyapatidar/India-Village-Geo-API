const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Internship project backend is running",
    project: "India Geo API"
  });
});

module.exports = router;
