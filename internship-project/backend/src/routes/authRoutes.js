const crypto = require("crypto");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const jwtAuth = require("../middleware/jwtAuth");

const router = express.Router();

function generateApiKey() {
  return `live_${crypto.randomBytes(20).toString("hex")}`;
}

function generateApiSecret() {
  return crypto.randomBytes(24).toString("hex");
}

router.post("/auth/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email, and password are required"
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "CLIENT"
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    return res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required"
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured"
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      secret,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/auth/api-keys", jwtAuth, async (req, res, next) => {
  try {
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: req.user.userId },
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        key: true,
        status: true,
        createdAt: true
      }
    });

    return res.json({
      success: true,
      count: apiKeys.length,
      data: apiKeys
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/auth/api-keys", jwtAuth, async (req, res, next) => {
  try {
    const key = generateApiKey();
    const plainSecret = generateApiSecret();
    const secretHash = await bcrypt.hash(plainSecret, 10);

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: req.user.userId,
        key,
        secretHash,
        status: "ACTIVE"
      },
      select: {
        id: true,
        key: true,
        status: true,
        createdAt: true
      }
    });

    return res.status(201).json({
      success: true,
      message: "Store apiSecret safely; it will not be shown again",
      data: {
        ...apiKey,
        apiSecret: plainSecret
      }
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
