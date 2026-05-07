const prisma = require("../lib/prisma");
const { rememberJson } = require("../lib/cache");
const { formatVillage } = require("../utils/geoFormatters");

const CACHE_TTL_SECONDS = Number(process.env.GEO_CACHE_TTL_SECONDS || 600);

function getPagination(options = {}) {
  const page = Math.max(Number(options.page || 1), 1);
  const requestedLimit = Math.max(Number(options.limit || 50), 1);
  const limit = Math.min(requestedLimit, 500);

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
}

function villageSelect() {
  return {
    id: true,
    villageCode: true,
    name: true,
    subDistrict: {
      select: {
        id: true,
        subDistrictCode: true,
        name: true,
        district: {
          select: {
            id: true,
            districtCode: true,
            name: true,
            state: {
              select: {
                id: true,
                stateCode: true,
                name: true,
                country: {
                  select: {
                    id: true,
                    code: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    }
  };
}

async function getCountry() {
  return rememberJson("geo:country", CACHE_TTL_SECONDS, () =>
    prisma.country.findFirst({
      select: {
        id: true,
        code: true,
        name: true
      }
    })
  );
}

async function getStates() {
  return rememberJson("geo:states", CACHE_TTL_SECONDS, async () => {
    const states = await prisma.state.findMany({
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        stateCode: true,
        name: true
      }
    });

    return states.map((state) => ({
      id: state.id,
      code: state.stateCode,
      name: state.name
    }));
  });
}

async function getDistrictsByStateCode(stateCode) {
  return rememberJson(`geo:districts:${stateCode}`, CACHE_TTL_SECONDS, async () => {
    const districts = await prisma.district.findMany({
      where: { state: { stateCode } },
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        districtCode: true,
        name: true
      }
    });

    return districts.map((district) => ({
      id: district.id,
      code: district.districtCode,
      name: district.name,
      stateCode
    }));
  });
}

async function getSubDistrictsByDistrictCode(districtCode) {
  return rememberJson(
    `geo:sub-districts:${districtCode}`,
    CACHE_TTL_SECONDS,
    async () => {
      const subDistricts = await prisma.subDistrict.findMany({
        where: { district: { districtCode } },
        orderBy: [{ name: "asc" }],
        select: {
          id: true,
          subDistrictCode: true,
          name: true,
          district: {
            select: {
              districtCode: true
            }
          }
        }
      });

      return subDistricts.map((subDistrict) => ({
        id: subDistrict.id,
        code: subDistrict.subDistrictCode,
        name: subDistrict.name,
        districtCode: subDistrict.district.districtCode
      }));
    }
  );
}

async function getVillages(filters = {}, options = {}) {
  const where = {};
  const { page, limit, skip } = getPagination(options);

  if (filters.subDistrictCode) {
    where.subDistrict = { subDistrictCode: filters.subDistrictCode };
  } else if (filters.districtCode) {
    where.subDistrict = { district: { districtCode: filters.districtCode } };
  } else if (filters.stateCode) {
    where.subDistrict = {
      district: {
        state: { stateCode: filters.stateCode }
      }
    };
  }

  const cacheKey = `geo:villages:${JSON.stringify({ filters, page, limit })}`;

  return rememberJson(cacheKey, CACHE_TTL_SECONDS, async () => {
    const [total, villages] = await Promise.all([
      prisma.village.count({ where }),
      prisma.village.findMany({
        where,
        orderBy: [{ name: "asc" }],
        skip,
        take: limit,
        select: villageSelect()
      })
    ]);

    return {
      data: villages.map(formatVillage),
      meta: {
        count: villages.length,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  });
}

async function searchVillagesByName(searchText, options = {}) {
  const { page, limit, skip } = getPagination(options);
  const where = {
    name: {
      contains: searchText,
      mode: "insensitive"
    }
  };
  const cacheKey = `geo:village-search:${JSON.stringify({ searchText, page, limit })}`;

  return rememberJson(cacheKey, CACHE_TTL_SECONDS, async () => {
    const [total, villages] = await Promise.all([
      prisma.village.count({ where }),
      prisma.village.findMany({
        where,
        orderBy: [{ name: "asc" }],
        skip,
        take: limit,
        select: villageSelect()
      })
    ]);

    return {
      data: villages.map(formatVillage),
      meta: {
        count: villages.length,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        search: searchText
      }
    };
  });
}

async function getVillageByCode(villageCode) {
  const result = await rememberJson(
    `geo:village:${villageCode}`,
    CACHE_TTL_SECONDS,
    () =>
      prisma.village.findFirst({
        where: { villageCode },
        select: villageSelect()
      })
  );
  const village = result.value;

  if (!village) {
    return { value: null, cache: result.cache };
  }

  const formattedVillage = formatVillage(village);

  return {
    cache: result.cache,
    value: {
    id: village.id,
    code: village.villageCode,
    name: village.name,
    standardizedAddress: formattedVillage.standardizedAddress,
    hierarchy: {
      country: village.subDistrict.district.state.country,
      state: {
        id: village.subDistrict.district.state.id,
        code: village.subDistrict.district.state.stateCode,
        name: village.subDistrict.district.state.name
      },
      district: {
        id: village.subDistrict.district.id,
        code: village.subDistrict.district.districtCode,
        name: village.subDistrict.district.name
      },
      subDistrict: {
        id: village.subDistrict.id,
        code: village.subDistrict.subDistrictCode,
        name: village.subDistrict.name
      }
    }
    }
  };
}

module.exports = {
  getCountry,
  getStates,
  getDistrictsByStateCode,
  getSubDistrictsByDistrictCode,
  getVillages,
  searchVillagesByName,
  getVillageByCode
};
