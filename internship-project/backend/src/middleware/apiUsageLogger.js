const prisma = require("../lib/prisma");

function apiUsageLogger(req, res, next) {
  const startTime = Date.now();

  res.on("finish", async () => {
    try {
      if (!req.auth || !req.auth.apiKeyId) {
        return;
      }

      if (!req.originalUrl.startsWith("/api/v1")) {
        return;
      }

      const responseTime = Date.now() - startTime;

      await prisma.apiLog.create({
        data: {
          apiKeyId: req.auth.apiKeyId,
          endpoint: `${req.method} ${req.originalUrl}`,
          responseTime
        }
      });
    } catch (error) {
      // Keep API responses stable even if logging fails.
      console.error("Api log write failed:", error.message);
    }
  });

  next();
}

module.exports = apiUsageLogger;
