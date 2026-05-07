const express = require("express");
const {
  getCountry,
  getStates,
  getDistrictsByStateCode,
  getSubDistrictsByDistrictCode,
  getVillages,
  searchVillagesByName,
  getVillageByCode
} = require("../services/geoService");
const { sendSuccess, sendNotFound } = require("../utils/responseHelpers");

const router = express.Router();

router.get("/country", async (req, res, next) => {
  try {
    const result = await getCountry();
    res.setHeader("X-Cache", result.cache);
    sendSuccess(res, result.value);
  } catch (error) {
    next(error);
  }
});

router.get("/states", async (req, res, next) => {
  try {
    const result = await getStates();
    res.setHeader("X-Cache", result.cache);
    sendSuccess(res, result.value, { count: result.value.length });
  } catch (error) {
    next(error);
  }
});

router.get("/districts", async (req, res, next) => {
  const { stateCode } = req.query;

  if (!stateCode) {
    return res.status(400).json({
      success: false,
      message: "stateCode query parameter is required"
    });
  }

  try {
    const result = await getDistrictsByStateCode(stateCode);
    res.setHeader("X-Cache", result.cache);
    sendSuccess(res, result.value, { count: result.value.length, stateCode });
  } catch (error) {
    next(error);
  }
});

router.get("/sub-districts", async (req, res, next) => {
  const { districtCode } = req.query;

  if (!districtCode) {
    return res.status(400).json({
      success: false,
      message: "districtCode query parameter is required"
    });
  }

  try {
    const result = await getSubDistrictsByDistrictCode(districtCode);
    res.setHeader("X-Cache", result.cache);
    sendSuccess(res, result.value, {
      count: result.value.length,
      districtCode
    });
  } catch (error) {
    next(error);
  }
});

router.get("/villages", async (req, res, next) => {
  try {
    const villages = await getVillages({
      stateCode: req.query.stateCode,
      districtCode: req.query.districtCode,
      subDistrictCode: req.query.subDistrictCode
    }, {
      page: req.query.page,
      limit: req.query.limit
    });

    res.setHeader("X-Cache", villages.cache);
    sendSuccess(res, villages.value.data, villages.value.meta);
  } catch (error) {
    next(error);
  }
});

router.get("/villages/search", async (req, res, next) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "name query parameter is required"
    });
  }

  try {
    const villages = await searchVillagesByName(name, {
      page: req.query.page,
      limit: req.query.limit
    });
    res.setHeader("X-Cache", villages.cache);
    sendSuccess(res, villages.value.data, villages.value.meta);
  } catch (error) {
    next(error);
  }
});

router.get("/villages/:code", async (req, res, next) => {
  try {
    const result = await getVillageByCode(req.params.code);

    if (!result.value) {
      return sendNotFound(res, "Village not found");
    }

    res.setHeader("X-Cache", result.cache);
    sendSuccess(res, result.value);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
