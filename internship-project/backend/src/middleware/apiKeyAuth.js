const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

async function apiKeyAuth(req, res, next) {
  try {
    const apiKeyHeader = req.header("x-api-key");
    const apiSecretHeader = req.header("x-api-secret");

    if (!apiKeyHeader) {
      return res.status(401).json({
        success: false,
        message: "Missing x-api-key header"
      });
    }

    if (!apiSecretHeader) {
      return res.status(401).json({
        success: false,
        message: "Missing x-api-secret header"
      });
    }

    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKeyHeader },
      select: {
        id: true,
        key: true,
        secretHash: true,
        status: true,
        userId: true
      }
    });

    if (!apiKeyRecord || apiKeyRecord.status !== "ACTIVE") {
      return res.status(401).json({
        success: false,
        message: "Invalid or inactive API key"
      });
    }

    const isSecretValid = await bcrypt.compare(
      apiSecretHeader,
      apiKeyRecord.secretHash
    );

    if (!isSecretValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid API secret"
      });
    }

    req.auth = {
      apiKeyId: apiKeyRecord.id,
      userId: apiKeyRecord.userId,
      apiKey: apiKeyRecord.key
    };

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = apiKeyAuth;
