const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const [
    countries,
    states,
    districts,
    subDistricts,
    villages,
    users,
    apiKeys,
    apiLogs
  ] =
    await Promise.all([
      prisma.country.count(),
      prisma.state.count(),
      prisma.district.count(),
      prisma.subDistrict.count(),
      prisma.village.count(),
      prisma.user.count(),
      prisma.apiKey.count(),
      prisma.apiLog.count()
    ]);

  console.log(
    JSON.stringify(
      {
        countries,
        states,
        districts,
        subDistricts,
        villages,
        users,
        apiKeys,
        apiLogs
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error("Count check failed:");
    console.error(error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
