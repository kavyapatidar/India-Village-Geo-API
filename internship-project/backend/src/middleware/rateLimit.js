const prisma = require("../lib/prisma");
const { incrementDailyCounter } = require("../lib/cache");

function getDailyLimit() {
  const rawValue = process.env.DAILY_API_LIMIT;
  const parsed = Number(rawValue);

  if (!rawValue || Number.isNaN(parsed) || parsed <= 0) {
    return 5000;
  }

  return parsed;
}

function getStartOfUtcDay() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function getSecondsUntilNextUtcDay() {
  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );

  return Math.ceil((tomorrow.getTime() - now.getTime()) / 1000);
}

async function rateLimit(req, res, next) {
  try {
    if (!req.auth || !req.auth.apiKeyId) {
      return next();
    }

    const dailyLimit = getDailyLimit();
    const dayKey = getStartOfUtcDay().toISOString().slice(0, 10);
    const counterKey = `rate:${req.auth.apiKeyId}:${dayKey}`;
    const usageCount = await incrementDailyCounter(
      counterKey,
      getSecondsUntilNextUtcDay()
    );

    if (usageCount >= dailyLimit) {
      return res.status(429).json({
        success: false,
        message: "Daily API rate limit exceeded",
        limit: dailyLimit,
        used: usageCount
      });
    }

    res.setHeader("X-RateLimit-Limit", String(dailyLimit));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(dailyLimit - usageCount, 0)));

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = rateLimit;
