const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function generateApiKey() {
  return `test_${crypto.randomBytes(16).toString("hex")}`;
}

async function main() {
  const email = "demo-client@internship.local";
  const plainPassword = "DemoPass123!";

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Demo Client",
      email,
      passwordHash: await bcrypt.hash(plainPassword, 10),
      role: "CLIENT"
    }
  });

  const key = generateApiKey();
  const secret = crypto.randomBytes(24).toString("hex");

  const apiKey = await prisma.apiKey.create({
    data: {
      userId: user.id,
      key,
      secretHash: await bcrypt.hash(secret, 10),
      status: "ACTIVE"
    }
  });

  console.log("Test API key created successfully.");
  console.log(`User email: ${email}`);
  console.log(`User password: ${plainPassword}`);
  console.log(`API key id: ${apiKey.id}`);
  console.log(`x-api-key: ${key}`);
  console.log(`x-api-secret: ${secret}`);
}

main()
  .catch((error) => {
    console.error("Failed to create test API key:");
    console.error(error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
