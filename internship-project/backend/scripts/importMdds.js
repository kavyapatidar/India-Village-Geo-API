const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const dotenv = require("dotenv");

dotenv.config();

const DATASET_DIR = path.join(
  __dirname,
  "..",
  "data",
  "raw",
  "mdds-master.xlsx",
  "dataset"
);
const REPORTS_DIR = path.join(__dirname, "..", "reports");

const VALID_EXTENSIONS = new Set([".xls", ".xlsx", ".ods"]);

const args = new Set(process.argv.slice(2));
const isDryRun = args.has("--dry-run") || !args.has("--write");
const shouldWrite = args.has("--write");
const batchSizeArg = process.argv
  .slice(2)
  .find((arg) => arg.startsWith("--batch-size="));
const importBatchSize = Number(
  batchSizeArg?.split("=")[1] || process.env.IMPORT_BATCH_SIZE || 5000
);

const headerAliases = {
  stateCode: ["MDDS STC", "STC", "STATE CODE"],
  stateName: ["STATE NAME"],
  districtCode: ["MDDS DTC", "DTC", "DISTRICT CODE"],
  districtName: ["DISTRICT NAME"],
  subDistrictCode: ["MDDS Sub_DT", "MDDS SUB_DT", "SUB_DISTRICT CODE", "SUB DT"],
  subDistrictName: ["SUB-DISTRICT NAME", "SUB DISTRICT NAME", "SUBDISTRICT NAME"],
  villageCode: ["MDDS PLCN", "PLCN", "VILLAGE CODE", "LOCALITY CODE"],
  villageName: ["Area Name", "AREA NAME", "VILLAGE NAME"]
};

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function buildRowAccessor(row) {
  const map = new Map();
  for (const [key, value] of Object.entries(row)) {
    map.set(normalizeHeader(key), value);
  }

  return (aliases) => {
    for (const alias of aliases) {
      const hit = map.get(normalizeHeader(alias));
      if (hit !== undefined && hit !== null && String(hit).trim() !== "") {
        return String(hit).trim();
      }
    }
    return "";
  };
}

function isAllZeroCode(value) {
  return /^0+$/.test(String(value || "").trim());
}

function listDatasetFiles() {
  if (!fs.existsSync(DATASET_DIR)) {
    throw new Error(`Dataset folder not found: ${DATASET_DIR}`);
  }

  return fs
    .readdirSync(DATASET_DIR)
    .filter((name) => VALID_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .map((name) => path.join(DATASET_DIR, name))
    .sort();
}

function parseSheetRows(filePath) {
  const workbook = xlsx.readFile(filePath, { cellDates: false });
  const firstSheetName = workbook.SheetNames[0];
  const firstSheet = workbook.Sheets[firstSheetName];
  return xlsx.utils.sheet_to_json(firstSheet, { defval: "" });
}

function normalizeGeoRow(rawRow) {
  const get = buildRowAccessor(rawRow);

  return {
    stateCode: get(headerAliases.stateCode),
    stateName: get(headerAliases.stateName),
    districtCode: get(headerAliases.districtCode),
    districtName: get(headerAliases.districtName),
    subDistrictCode: get(headerAliases.subDistrictCode),
    subDistrictName: get(headerAliases.subDistrictName),
    villageCode: get(headerAliases.villageCode),
    villageName: get(headerAliases.villageName)
  };
}

function isUsableVillageRow(row) {
  if (
    !row.stateCode ||
    !row.stateName ||
    !row.districtCode ||
    !row.districtName ||
    !row.subDistrictCode ||
    !row.subDistrictName ||
    !row.villageCode ||
    !row.villageName
  ) {
    return false;
  }

  if (
    isAllZeroCode(row.districtCode) ||
    isAllZeroCode(row.subDistrictCode) ||
    isAllZeroCode(row.villageCode)
  ) {
    return false;
  }

  return true;
}

function getSkipReason(row) {
  const requiredFields = [
    "stateCode",
    "stateName",
    "districtCode",
    "districtName",
    "subDistrictCode",
    "subDistrictName",
    "villageCode",
    "villageName"
  ];
  const missingField = requiredFields.find((field) => !row[field]);

  if (missingField) {
    return `Missing ${missingField}`;
  }

  if (isAllZeroCode(row.districtCode)) {
    return "District code is all zeroes";
  }

  if (isAllZeroCode(row.subDistrictCode)) {
    return "Sub-district code is all zeroes";
  }

  if (isAllZeroCode(row.villageCode)) {
    return "Village code is all zeroes";
  }

  return null;
}

function incrementCount(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function writeImportReport(summary) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const reportPath = path.join(REPORTS_DIR, "mdds-import-summary.json");
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  return reportPath;
}

function uniqueBy(rows, getKey) {
  const seen = new Map();

  for (const row of rows) {
    const key = getKey(row);
    if (!seen.has(key)) {
      seen.set(key, row);
    }
  }

  return Array.from(seen.values());
}

function chunkArray(items, size) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

async function writeRowsToDb(rows) {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  try {
    const country = await prisma.country.upsert({
      where: { code: "IND" },
      update: { name: "India" },
      create: { code: "IND", name: "India" }
    });

    const uniqueStates = uniqueBy(rows, (row) => row.stateCode);
    await prisma.state.createMany({
      data: uniqueStates.map((row) => ({
        stateCode: row.stateCode,
        name: row.stateName,
        countryId: country.id
      })),
      skipDuplicates: true
    });

    const states = await prisma.state.findMany({
      where: { countryId: country.id },
      select: { id: true, stateCode: true }
    });
    const stateIdByCode = new Map(states.map((state) => [state.stateCode, state.id]));

    const uniqueDistricts = uniqueBy(
      rows,
      (row) => `${row.stateCode}::${row.districtCode}`
    );
    const districtRecords = uniqueDistricts.map((row) => ({
      stateId: stateIdByCode.get(row.stateCode),
      districtCode: row.districtCode,
      name: row.districtName
    }));

    for (const batch of chunkArray(districtRecords, importBatchSize)) {
      await prisma.district.createMany({
        data: batch,
        skipDuplicates: true
      });
    }

    const districts = await prisma.district.findMany({
      select: {
        id: true,
        districtCode: true,
        state: { select: { stateCode: true } }
      }
    });
    const districtIdByKey = new Map(
      districts.map((district) => [
        `${district.state.stateCode}::${district.districtCode}`,
        district.id
      ])
    );

    const uniqueSubDistricts = uniqueBy(
      rows,
      (row) => `${row.stateCode}::${row.districtCode}::${row.subDistrictCode}`
    );
    const subDistrictRecords = uniqueSubDistricts.map((row) => ({
      districtId: districtIdByKey.get(`${row.stateCode}::${row.districtCode}`),
      subDistrictCode: row.subDistrictCode,
      name: row.subDistrictName
    }));

    for (const batch of chunkArray(subDistrictRecords, importBatchSize)) {
      await prisma.subDistrict.createMany({
        data: batch,
        skipDuplicates: true
      });
    }

    const subDistricts = await prisma.subDistrict.findMany({
      select: {
        id: true,
        subDistrictCode: true,
        district: {
          select: {
            districtCode: true,
            state: { select: { stateCode: true } }
          }
        }
      }
    });
    const subDistrictIdByKey = new Map(
      subDistricts.map((subDistrict) => [
        [
          subDistrict.district.state.stateCode,
          subDistrict.district.districtCode,
          subDistrict.subDistrictCode
        ].join("::"),
        subDistrict.id
      ])
    );

    const uniqueVillages = uniqueBy(
      rows,
      (row) =>
        [
          row.stateCode,
          row.districtCode,
          row.subDistrictCode,
          row.villageCode
        ].join("::")
    );
    const villageRecords = uniqueVillages.map((row) => ({
      subDistrictId: subDistrictIdByKey.get(
        `${row.stateCode}::${row.districtCode}::${row.subDistrictCode}`
      ),
      villageCode: row.villageCode,
      name: row.villageName
    }));

    const villageBatches = chunkArray(villageRecords, importBatchSize);

    for (let index = 0; index < villageBatches.length; index += 1) {
      await prisma.village.createMany({
        data: villageBatches[index],
        skipDuplicates: true
      });

      if ((index + 1) % 25 === 0 || index + 1 === villageBatches.length) {
        console.log(
          `Imported village batches: ${index + 1}/${villageBatches.length}`
        );
      }
    }

    console.log(`States prepared: ${uniqueStates.length}`);
    console.log(`Districts prepared: ${uniqueDistricts.length}`);
    console.log(`Sub-districts prepared: ${uniqueSubDistricts.length}`);
    console.log(`Village records prepared: ${uniqueVillages.length}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const files = listDatasetFiles();
  const usableRows = [];
  const skipReasons = new Map();
  const skippedSamples = [];

  let totalRowsRead = 0;
  let skippedRows = 0;

  console.log(`Found ${files.length} dataset files`);
  console.log(`Mode: ${isDryRun ? "DRY RUN (no DB writes)" : "WRITE TO DB"}`);

  for (const filePath of files) {
    const rows = parseSheetRows(filePath);
    totalRowsRead += rows.length;

    for (const rawRow of rows) {
      const row = normalizeGeoRow(rawRow);
      const skipReason = getSkipReason(row);

      if (skipReason) {
        skippedRows += 1;
        incrementCount(skipReasons, skipReason);

        if (skippedSamples.length < 25) {
          skippedSamples.push({
            file: path.basename(filePath),
            reason: skipReason,
            row
          });
        }
        continue;
      }
      usableRows.push(row);
    }
  }

  console.log(`Total rows read: ${totalRowsRead}`);
  console.log(`Usable village rows: ${usableRows.length}`);
  console.log(`Skipped rows: ${skippedRows}`);

  const summary = {
    importedAt: new Date().toISOString(),
    mode: isDryRun ? "dry-run" : "write",
    datasetFiles: files.length,
    totalRowsRead,
    usableVillageRows: usableRows.length,
    skippedRows,
    skipReasons: Object.fromEntries(skipReasons),
    skippedSamples
  };

  if (shouldWrite) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing. Create backend/.env first.");
    }

    console.log("Starting database import...");
    await writeRowsToDb(usableRows);
    console.log("Database import completed.");
  } else {
    console.log("Dry run complete. No DB changes were made.");
  }

  const reportPath = writeImportReport(summary);
  console.log(`Import report written: ${reportPath}`);
}

main().catch((error) => {
  console.error("Import failed:");
  console.error(error.message);
  process.exit(1);
});
