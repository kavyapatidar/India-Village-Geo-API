const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@internship.local";
  const plainPassword = "AdminPass123!";

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name: "Project Admin",
      passwordHash: await bcrypt.hash(plainPassword, 10),
      role: "ADMIN"
    },
    create: {
      name: "Project Admin",
      email,
      passwordHash: await bcrypt.hash(plainPassword, 10),
      role: "ADMIN"
    },
    select: {
      id: true,
      email: true,
      role: true
    }
  });

  console.log("Admin user ready.");
  console.log(`User id: ${admin.id}`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${plainPassword}`);
}

main()
  .catch((error) => {
    console.error("Failed to create admin user:");
    console.error(error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
