const express = require("express");
const prisma = require("../lib/prisma");
const jwtAuth = require("../middleware/jwtAuth");

const router = express.Router();

function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });
  }

  return next();
}

router.get("/admin/usage-summary", jwtAuth, requireAdmin, async (req, res, next) => {
  try {
    const [users, apiKeys, logs, recentLogs, slowestEndpoints] = await Promise.all([
      prisma.user.count(),
      prisma.apiKey.count(),
      prisma.apiLog.count(),
      prisma.apiLog.findMany({
        orderBy: [{ createdAt: "desc" }],
        take: 10,
        select: {
          id: true,
          endpoint: true,
          responseTime: true,
          createdAt: true,
          apiKey: {
            select: {
              key: true,
              user: { select: { email: true } }
            }
          }
        }
      }),
      prisma.apiLog.groupBy({
        by: ["endpoint"],
        _avg: { responseTime: true },
        _count: { endpoint: true },
        orderBy: { _avg: { responseTime: "desc" } },
        take: 10
      })
    ]);

    res.json({
      success: true,
      data: {
        users,
        apiKeys,
        totalRequests: logs,
        recentLogs,
        slowestEndpoints
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
